import TelegramBot from 'node-telegram-bot-api';
import { config } from './config';
import {handleStart} from './handlers/commands';
import { handleImage } from "./handlers/image";
import {t} from "./i18n/translate";
import { isBotCommand } from './utils/bot';
import { BotCommands } from './constants/bot';

const bot = new TelegramBot(config.botToken);

export const handler = async (event: any) => {
  try {
    const body = JSON.parse(event.body);
    console.log('event:body',JSON.stringify(body, null, 2));
    if (body.message) {
      console.log('if:body.message',JSON.stringify(body, null, 2));
      const chatId = body.message.chat.id;
      const text = body.message.text;
      const user = body.message.from;

      console.log({
        chatId,
        text,
        user,
      });

      // Check if the text starts with a slash
      if (isBotCommand(text)) {
        const [command, payload] = text.split(' ', 2); // Split into command and optional payload
        console.log({ command, payload });

        switch (command) {
          case BotCommands.START:
            await handleStart(bot, chatId, user);
            break;
          case BotCommands.IMAGE:
            await handleImage(bot, chatId, user, payload || '');
            break;
          default:
            await bot.sendMessage(chatId, t('errors.unknownCommand', user.language_code || 'ru', { command }));
            break;
        }
      } else {
        // Default handler for non-command text
        await bot.sendMessage(chatId, t('errors.unknownMessage', user.language_code || 'ru'));
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Success' }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};