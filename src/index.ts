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
        const [command, ...payloadParts] = text.split(' '); // Split command and keep all payload parts
        const payload = payloadParts.join(' '); // Join payload parts back together

        switch (command) {
          case BotCommands.START:
            const commands = [
              { command: BotCommands.START, description: t('commands.start', user.language_code) },
              { command: BotCommands.IMAGE, description: t('commands.image', user.language_code) }
            ];

            const commandsList = commands
                .map(cmd => `${cmd.command} - ${cmd.description}`)
                .join('\n');

            await bot.sendMessage(chatId, t('welcome.greeting', user.language_code, { name: user.first_name }));
            await bot.sendMessage(chatId, t('welcome.commands', user.language_code, { commands: commandsList }));
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