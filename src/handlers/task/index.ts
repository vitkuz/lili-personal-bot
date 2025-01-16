import { DynamoDBStreamEvent, Context } from 'aws-lambda';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import axios from 'axios';
import TelegramBot from 'node-telegram-bot-api';
import { logger } from '../../utils/logger';
import { config } from '../../config';
import { ApiEndpoints } from '../../constants/bot';
import { t } from '../../i18n/translate';
import { DefaultLanguage } from '../../constants/bot';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { PutCommand, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { createDynamoDBClient } from '../../config/dynamodb';
import { v4 as uuidv4 } from 'uuid';

enum TaskStatus {
    STARTING = 'starting',
    PROCESSING = 'processing',
    SUCCEEDED = 'succeeded',
    FAILED = 'failed'
}

interface TaskRecord {
    predictionId: string;
    status: TaskStatus;
    chatId: number;
    createdAt?: string;
    updatedAt?: string;
    prompt: string;
    ttl?: number;
    output?: string[];
    images?: string[];
    error?: string;
}

const docClient = createDynamoDBClient();
const s3Client = new S3Client({});
const bot = new TelegramBot(config.botToken);

function getDateBasedPath(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `images/${year}/${month}/${day}`;
}

async function downloadAndUploadToS3(imageUrl: string): Promise<string> {
    try {
        // Download image
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data);

        // Generate unique filename with date-based path
        const extension = imageUrl.split('.').pop() || 'jpg';
        const filename = `${uuidv4()}.${extension}`;
        const datePath = getDateBasedPath();
        const key = `${datePath}/${filename}`;

        // Upload to S3
        await s3Client.send(new PutObjectCommand({
            Bucket: config.botImagesBucket,
            Key: key,
            Body: buffer,
            ContentType: `image/${extension}`,
        }));

        // Return public URL
        return `https://${config.botImagesBucket}.s3.amazonaws.com/${key}`;
    } catch (error) {
        logger.error('Failed to process image', error as Error);
        throw error;
    }
}
async function recordTask(task: Partial<TaskRecord> & { predictionId: string }, chatId: number) {
    const now = new Date();

    try {
        // First get the existing record
        const existingRecord = await docClient.send(new GetCommand({
            TableName: config.tables.imageGenerationTask,
            Key: { predictionId: task.predictionId }
        }));

        // Prepare update expression and attribute values
        const updateExpr = ['set updatedAt = :updatedAt'];
        const exprAttrValues: any = {
            ':updatedAt': now.toISOString()
        };

        if (task.status) {
            updateExpr.push('status = :status');
            exprAttrValues[':status'] = task.status;
        }

        if (task.output) {
            updateExpr.push('output = :output');
            exprAttrValues[':output'] = task.output;
        }

        if (task.images) {
            updateExpr.push('images = :images');
            exprAttrValues[':images'] = task.images;
        }

        // Update the record
        await docClient.send(new UpdateCommand({
            TableName: config.tables.imageGenerationTask,
            Key: { predictionId: task.predictionId },
            UpdateExpression: updateExpr.join(', '),
            ExpressionAttributeValues: exprAttrValues
        }));
    } catch (error) {
        logger.error('Failed to update task record', error as Error);
        throw error;
    }
}

async function pollPredictionStatus(predictionId: string): Promise<TaskRecord | null> {
    try {
        const response = await axios.get(`${ApiEndpoints.IMAGE_GENERATION}?predictionId=${predictionId}`);
        const { id, status, output, prompt } = response.data;
        return {
            predictionId: id,
            status,
            output,
            prompt,
            chatId: 0 // This will be overwritten when recording
        };
    } catch (error) {
        logger.error('Failed to poll prediction status', error as Error);
        return null;
    }
}

async function sendImagesToTelegram(chatId: number, images: string[], task: TaskRecord) {
    try {
        for (const imageUrl of images) {
            const caption = t('image.generated', DefaultLanguage.CODE, {
                prompt: task.prompt,
                link: imageUrl
            });

            await bot.sendPhoto(chatId, imageUrl, {
                caption
            });
        }
    } catch (error) {
        logger.error('Failed to send images to Telegram', error as Error);
    }
}

async function handleTaskUpdate(newImage: TaskRecord) {
    let currentStatus = newImage.status;
    let attempts = 0;
    const maxAttempts = 20; // 1 minute total (20 * 3 seconds)

    if (currentStatus !== TaskStatus.SUCCEEDED ) {

        while (currentStatus !== TaskStatus.SUCCEEDED && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds

            const updatedTask = await pollPredictionStatus(newImage.predictionId);
            if (!updatedTask) {
                // @ts-ignore
                logger.error('Failed to get task update', { predictionId: newImage.predictionId });
                break;
            }

            currentStatus = updatedTask.status;
            await recordTask(updatedTask, newImage.chatId);
            attempts++;

            if (currentStatus === TaskStatus.SUCCEEDED && updatedTask.output) {
                // Download and upload images to S3
                const s3Images = await Promise.all(
                    updatedTask.output.map(url => downloadAndUploadToS3(url))
                );

                // Update task with S3 URLs
                const taskWithImages = {
                    ...updatedTask,
                    images: s3Images
                };
                await recordTask(taskWithImages, newImage.chatId);

                // Send images to Telegram
                await sendImagesToTelegram(newImage.chatId, s3Images, updatedTask);
            }
        }
    }
}

export const handler = async (event: DynamoDBStreamEvent, context: Context) => {
    logger.info('Processing DynamoDB Stream event', {
        requestId: context.awsRequestId,
        records: event.Records.length
    });

    for (const record of event.Records) {
        if (record.eventName === 'INSERT') {
            // Unmarshal the NewImage (only available for INSERT and MODIFY events)
            const newImage = record.dynamodb?.NewImage
                // @ts-ignore
                ? unmarshall(record.dynamodb.NewImage) as TaskRecord
                : undefined;

            logger.info('Processing INSERT record', {
                eventId: record.eventID,
                newImage
            });

            if (newImage) {
                await handleTaskUpdate(newImage);
            }
        }
    }
};