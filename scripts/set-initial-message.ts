import axios from 'axios';
import { config } from 'dotenv';
import { logger } from '../src/utils/logger';

config();

const descriptions = [
    {
        language_code: 'ru', // Russian
        description: `🎨 Бот для генерации изображений с помощью искусственного интеллекта.\n\n💡 Просто отправьте команду /image с описанием желаемого изображения, и бот создаст его для вас.\n\n✨ Попробуйте прямо сейчас!`
    },
    {
        language_code: 'en', // English
        description: `🎨 AI Image Generation Bot.\n\n💡 Simply send the /image command with a description of the desired image, and the bot will create it for you.\n\n✨ Try it now!`
    }
];

const names = [
    {
        language_code: 'ru', // Russian
        name: "AI Image Generator Bot"
    },
    {
        language_code: 'en', // English
        name: "AI Image Generator Bot"
    }
];

async function setInitialBotMessage() {
    const token = process.env.BOT_TOKEN;

    if (!token) {
        throw new Error('BOT_TOKEN environment variable is required');
    }

    try {
        for (const { language_code, description } of descriptions) {
            const response = await axios.post(
                `https://api.telegram.org/bot${token}/setMyDescription`,
                {
                    description,
                    language_code
                }
            );

            if (response.data.ok) {
                logger.info(`Initial message set successfully for language: ${language_code}`);
            } else {
                throw new Error(`Failed to set initial message for language: ${language_code}`);
            }
        }

        // Set names
        for (const { language_code, name } of names) {
            const response = await axios.post(
                `https://api.telegram.org/bot${token}/setMyName`,
                {
                    name,
                    language_code
                }
            );

            if (response.data.ok) {
                logger.info(`Name set successfully for language: ${language_code}`);
            } else {
                throw new Error(`Failed to set name for language: ${language_code}`);
            }
        }

    } catch (error) {
        console.log(error)
        logger.error('Error setting bot initial message:', error as Error);
        process.exit(1);
    }
}

setInitialBotMessage();