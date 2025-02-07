import TelegramBot from 'node-telegram-bot-api';
import { TelegramUser } from '../types';
import { t } from '../i18n/translate';
import { logger } from '../utils/logger';
import { DefaultLanguage } from '../constants/bot';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { createDynamoDBClient } from '../config/dynamodb';
import { config } from '../config';

const docClient = createDynamoDBClient();

export async function handleStatus(bot: TelegramBot, chatId: number, user: TelegramUser, predictionId: string) {
  const lang = user.language_code || DefaultLanguage.CODE;

  if (!predictionId) {
    await bot.sendMessage(chatId, t('status.noId', lang));
    return;
  }

  try {
    const result = await docClient.send(new GetCommand({
      TableName: config.tables.imageGenerationTask,
      Key: { predictionId }
    }));

    if (!result.Item) {
      await bot.sendMessage(chatId, t('status.notFound', lang));
      return;
    }

    const task = result.Item;

    await bot.sendMessage(
        chatId,
        t('status.current', lang, {
          id: task.predictionId,
          status: task.status,
          prompt: task.prompt,
          createdAt: new Date(task.createdAt).toLocaleString()
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

  } catch (error) {
    logger.error('Failed to get task status', error as Error);
    await bot.sendMessage(chatId, t('errors.unknownError', lang));
  }
}