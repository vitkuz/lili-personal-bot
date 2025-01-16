import TelegramBot from 'node-telegram-bot-api';
import { generateImage } from './generate-image';
import { logger } from '../../utils/logger';
import { t } from '../../i18n/translate';
import { DefaultLanguage } from '../../constants/bot';
import { TelegramUser } from '../../types';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { createDynamoDBClient } from '../../config/dynamodb';
import { config } from '../../config';

interface ImageTask {
    predictionId: string;
    status: string;
    prompt: string;
}

const docClient = createDynamoDBClient();

async function recordImageTask(predictionId: string, status: string, chatId: number, prompt: string) {
    const now = new Date();

    await docClient.send(new PutCommand({
        TableName: config.tables.imageGenerationTask,
        Item: {
            predictionId,
            status,
            chatId,
            prompt,
            createdAt: now.toISOString(),
            updatedAt: now.toISOString()
        }
    }));
}

async function generateAndRecordTask(prompt: string, chatId: number): Promise<ImageTask> {
    const result = await generateImage(prompt);
    await recordImageTask(result.id, result.status, chatId, prompt);
    return {
        predictionId: result.id,
        status: result.status,
        prompt
    };
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

    // Split prompts by empty lines and filter out empty prompts
    const prompts = prompt.split('\n\n').map(p => p.trim()).filter(p => p.length > 0);

    if (prompts.length === 0) {
        await bot.sendMessage(
            chatId,
            t('image.noPrompt', lang)
        );
        return;
    }

    try {
        await bot.sendMessage(
            chatId,
            t('image.generating', lang, { count: prompts.length })
        );

        // Generate and record all tasks
        const tasks = await Promise.all(
            prompts.map(p => generateAndRecordTask(p, chatId))
        );

        // Send confirmation for each task
        for (const task of tasks) {
            await bot.sendMessage(
                chatId,
                t('image.taskCreated', lang, {
                    id: task.predictionId,
                    status: task.status,
                    prompt: task.prompt
                }),
                {
                    reply_markup: {
                        inline_keyboard: [[
                            {
                                text: t('status.checkButton', lang),
                                callback_data: `status_${task.predictionId}`
                            }
                        ]]
                    }
                }
            );
        }
    } catch (error) {
        logger.error('Image generation failed', error as Error);
        await bot.sendMessage(
            chatId,
            t('image.error', lang)
        );
    }
}