import axios from 'axios';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import { logger } from '../src/utils/logger';

config();

async function uploadBotPhoto() {
    const token = process.env.BOT_TOKEN;

    if (!token) {
        throw new Error('BOT_TOKEN environment variable is required');
    }

    try {
        // Construct the full path to the photo
        const photoPath = path.resolve(__dirname, 'travelgig_jobs_bot.jpg'); // Ensure 'travelgig_jobs_bot.jpg' is in the same directory as this script

        console.log(photoPath)
        if (!fs.existsSync(photoPath)) {
            throw new Error(`Photo file not found at path: ${photoPath}`);
        }

        const formData = new FormData();
        formData.append('photo', fs.createReadStream(photoPath));

        const response = await axios.post(
            `https://api.telegram.org/bot${token}/setUserProfilePhotos`,
            formData,
            {
                headers: formData.getHeaders(),
            }
        );

        console.log(response)

        if (response.data.ok) {
            logger.info('Photo uploaded successfully');
        } else {
            throw new Error(`Failed to upload bot photo: ${response.data.description}`);
        }
    } catch (error) {
        console.log(error)
        // @ts-ignore
        logger.error('Error uploading bot photo:', error.message || error);
        process.exit(1);
    }
}

uploadBotPhoto();
