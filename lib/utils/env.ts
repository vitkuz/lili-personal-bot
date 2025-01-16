import { config } from 'dotenv';

export function loadEnvVariables() {
    config();

    const requiredVars = ['BOT_TOKEN'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }

    return {
        botTokenValue: process.env.BOT_TOKEN!
    };
}