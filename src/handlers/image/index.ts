import TelegramBot from 'node-telegram-bot-api';
import { generateImage } from './generate-image';
import { logger } from '../../utils/logger';
import { t } from '../../i18n/translate';
import { DefaultLanguage } from '../../constants/bot';
import { TelegramUser } from '../../types'; 
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { createDynamoDBClient } from '../../config/dynamodb';
import { config } from '../../config';

const docClient = createDynamoDBClient();

async function recordImageTask(predictionId: string, status: string, chatId: number) {
    const now = new Date();
    const ttl = Math.floor(now.getTime() / 1000) + 24 * 60 * 60; // 24 hours TTL

    await docClient.send(new PutCommand({
        TableName: config.tables.imageGenerationTask,
        Item: {
            predictionId,
            status,
            chatId,
            createdAt: now.toISOString(),
            updatedAt: now.toISOString(),
            ttl
        }
    }));
}

export async function handleImage(bot: TelegramBot, chatId: number, user: TelegramUser, prompt: string) {
    const lang = user.language_code || DefaultLanguage.CODE;
    
    if (!prompt) {
        await bot.sendMessage(
            chatId,
            t('image.noPrompt', lang)
        );
        return;
    }

    try {
        await bot.sendMessage(
            chatId,
            t('image.generating', lang)
        );

        const result = await generateImage(prompt);
        
        // Record the task in DynamoDB
        await recordImageTask(result.id, result.status, chatId);
        
        await bot.sendMessage(
            chatId,
            t('image.taskCreated', lang, { 
                id: result.id,
                status: result.status 
            })
        );
    } catch (error) {
        logger.error('Image generation failed', error as Error);
        await bot.sendMessage(
            chatId,
            t('image.error', lang)
        );
    }
}