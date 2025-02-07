import TelegramBot from 'node-telegram-bot-api';
import { config } from './config';
import { handleStatus } from './handlers/commands';
import { handleImage } from "./handlers/image";
import {t} from "./i18n/translate";
import { isBotCommand } from './utils/bot';
import { BotCommands } from './constants/bot';

const bot = new TelegramBot(config.botToken);

export function isAllowedUser(userId: number): boolean {
  return [1020685461, 5246112454].includes(userId); // lily, vit
}

export const handler = async (event: any) => {
  try {
    const body = JSON.parse(event.body);
    console.log('event:body',JSON.stringify(body, null, 2));

    const chatId = body.message?.chat?.id || body.callback_query?.message?.chat?.id;
    const user = body.message?.from || body.callback_query?.from;
    const userId = user.id;
    const userLang = user.language_code;

    if(!isAllowedUser(userId)) {
      await bot.sendMessage(chatId, t('errors.unauthorized', userLang));
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Success' }),
      };
    }

    if (body.callback_query) {
      const callbackQuery = body.callback_query;
      // const chatId = callbackQuery.message.chat.id;
      // const user = callbackQuery.from;
      const data = callbackQuery.data;
      if (data.startsWith('status_')) {
        const predictionId = data.replace('status_', '');
        await handleStatus(bot, chatId, user, predictionId);
        await bot.answerCallbackQuery(callbackQuery.id);
      } else if (data.startsWith('image_')) {
        const prompt = data.replace('image_', '');
        await handleImage(bot, chatId, user, prompt);
        await bot.answerCallbackQuery(callbackQuery.id);
      }
    } else if (body.message) {
      console.log('if:body.message',JSON.stringify(body, null, 2));
      // const chatId = body.message.chat.id;
      const text = body.message.text;
      // const user = body.message.from;

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
              { command: BotCommands.START, description: t('commands.start', userLang) },
              { command: BotCommands.IMAGE, description: t('commands.image', userLang) }
            ];

            const commandsList = commands
                .map(cmd => `${cmd.command} - ${cmd.description}`)
                .join('\n');

            await bot.sendMessage(chatId, t('welcome.greeting', userLang, { name: user.first_name }));
            await bot.sendMessage(chatId, t('welcome.commands', userLang, { commands: commandsList }));
            break;
          case BotCommands.IMAGE:
            await handleImage(bot, chatId, user, payload || '');
            break;
          case BotCommands.STATUS:
            await handleStatus(bot, chatId, user, payload || '');
            break;
          default:
            await bot.sendMessage(chatId, t('errors.unknownCommand', userLang, { command }));
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