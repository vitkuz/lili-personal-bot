import axios from 'axios';
import { config } from 'dotenv';
import { logger } from '../src/utils/logger';
import { BotCommands } from '../src/constants/bot';

config();

const translations = [
    {
        language_code: 'en', // English
        commands: [
            { command: BotCommands.START.slice(1), description: 'Start the bot' },
            { command: BotCommands.IMAGE.slice(1), description: 'Generate an image based on your description' }
        ]
    },
    {
        language_code: 'ru', // Russian
        commands: [
            { command: BotCommands.START.slice(1), description: 'Запустить бота' },
            { command: BotCommands.IMAGE.slice(1), description: 'Сгенерировать изображение по вашему описанию' }
        ]
    }
];

async function updateBotCommands() {
    const token = process.env.BOT_TOKEN;

    if (!token) {
        throw new Error('BOT_TOKEN environment variable is required');
    }

    try {
        for (const { language_code, commands } of translations) {
            const response = await axios.post(
                `https://api.telegram.org/bot${token}/setMyCommands`,
                {
                    commands,
                    language_code
                }
            );

            if (response.data.ok) {
                logger.info(`Bot commands updated successfully for language: ${language_code}`);
            } else {
                throw new Error(`Failed to update bot commands for language: ${language_code}`);
            }
        }
    } catch (error) {
        logger.error('Error updating bot commands:', error as Error);
        process.exit(1);
    }
}

updateBotCommands();