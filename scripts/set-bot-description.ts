import axios from 'axios';
import { config } from 'dotenv';
import { logger } from '../src/utils/logger';

config();

async function updateBotDescription() {
    const token = process.env.BOT_TOKEN;

    if (!token) {
        throw new Error('BOT_TOKEN environment variable is required');
    }

    try {
        // Descriptions for different languages
        const descriptions = [
            { language_code: 'en', description: 'Your AI Recruiter and Digital HR Assistant. Finding the perfect job for you! @siberian_lily' },
            { language_code: 'ru', description: 'Ваш ИИ-рекрутер и цифровой HR-помощник. Поможем найти работу мечты! @siberian_lily' },
        ];

        // Update the description for each language
        for (const { language_code, description } of descriptions) {
            const response = await axios.post(
                `https://api.telegram.org/bot${token}/setMyDescription`,
                {
                    language_code,
                    description,
                }
            );

            if (response.data.ok) {
                logger.info(`Description updated successfully for language: ${language_code}`);
            } else {
                throw new Error(`Failed to update description for ${language_code}: ${response.data.description}`);
            }
        }
    } catch (error) {
        console.log(error)
        // @ts-ignore
        logger.error('Error updating bot descriptions:', error.message || error);
        process.exit(1);
    }
}

updateBotDescription();
