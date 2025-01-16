import axios from 'axios';
import { config } from 'dotenv';

config();

async function setupWebhook() {
  const token = process.env.BOT_TOKEN;
  const apiUrl = process.env.API_URL; // Get this from CDK output

  console.log({
    token,
    apiUrl
  })

  if (!token || !apiUrl) {
    throw new Error('BOT_TOKEN and API_URL environment variables are required');
  }

  try {
    const response = await axios.post(
      `https://api.telegram.org/bot${token}/setWebhook`,
      {
        url: apiUrl,
      }
    );

    console.log('Webhook setup response:', response.data);
  } catch (error) {
    console.error('Error setting up webhook:', error);
    process.exit(1);
  }
}

setupWebhook();