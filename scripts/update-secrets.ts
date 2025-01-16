import { SecretsManagerClient, UpdateSecretCommand } from '@aws-sdk/client-secrets-manager';
import { config } from 'dotenv';

config();
const client = new SecretsManagerClient({});
const botToken = process.env.BOT_TOKEN;

async function updateBotToken() {
    if (!botToken) {
        console.error('BOT_TOKEN environment variable is required');
        process.exit(1);
    }

    try {
        await client.send(new UpdateSecretCommand({
            SecretId: `vitkuz-bot-token`,
            SecretString: botToken,
        }));
        console.log('Bot token updated successfully');
    } catch (error) {
        console.error('Error updating bot token:', error);
        process.exit(1);
    }
}

updateBotToken();