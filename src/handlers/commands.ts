import TelegramBot from 'node-telegram-bot-api';
import { TelegramUser } from '../types';
import { t } from '../i18n/translate';
import { logger } from '../utils/logger';
import { BotCommands, DefaultLanguage } from '../constants/bot';

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
    { command: BotCommands.IMAGE, description: t('commands.image', lang) }
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