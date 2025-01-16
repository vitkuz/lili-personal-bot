import TelegramBot from 'node-telegram-bot-api';
import { TelegramUser } from '../types';
import { t } from '../i18n/translate';
import { logger } from '../utils/logger';
import { DefaultLanguage } from '../constants/bot';

export async function handleStart(bot: TelegramBot, chatId: number, user: TelegramUser) {
  const userId = user.id.toString();
  logger.user('Processing /start command', userId, {
    username: user.username,
    languageCode: user.language_code
  });

  const lang = user.language_code || DefaultLanguage.CODE;

  logger.debug('Sending welcome message', { chatId, userId: user.id });
  await bot.sendMessage(
    chatId,
    `${user.first_name}, ${t('welcome.message0', lang)}`
  );
  await bot.sendMessage(
      chatId,
      t('welcome.message1', lang)
  );
}