import TelegramBot from 'node-telegram-bot-api';
import { TelegramUser } from '../types';
import { t } from '../i18n/translate';
import { logger } from '../utils/logger';
import { BotCommands, DefaultLanguage } from '../constants/bot';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { createDynamoDBClient } from '../config/dynamodb';
import { config } from '../config';

const docClient = createDynamoDBClient();

export async function handleStart(bot: TelegramBot, chatId: number, user: TelegramUser) {
  const userId = user.id.toString();
  const lang = user.language_code || DefaultLanguage.CODE;

  logger.user('Processing /start command', userId, {
    username: user.username,
    languageCode: lang
  });

  // Define available commands with descriptions
  const commands = [
    { command: BotCommands.START, description: t('commands.start', lang) },
    { command: BotCommands.IMAGE, description: t('commands.image', lang) },
    { command: BotCommands.STATUS, description: t('commands.status', lang) }
  ];

  // Format commands list
  const commandsList = commands
      .map(cmd => `${cmd.command} - ${cmd.description}`)
      .join('\n');

  // Send welcome message
  await bot.sendMessage(
      chatId,
      t('welcome.greeting', lang, { name: user.first_name })
  );

  // Send commands list
  await bot.sendMessage(
      chatId,
      t('welcome.commands', lang, { commands: commandsList })
  );

  // Send note about English prompts
  await bot.sendMessage(
      chatId,
      t('image.noPrompt', lang)
  );
}

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

    const { status, prompt, createdAt } = result.Item;
    await bot.sendMessage(
        chatId,
        t('status.current', lang, {
          id: predictionId,
          status,
          prompt,
          createdAt: new Date(createdAt).toLocaleString()
        })
    );
  } catch (error) {
    logger.error('Failed to get task status', error as Error);
    await bot.sendMessage(chatId, t('errors.unknownError', lang));
  }
}