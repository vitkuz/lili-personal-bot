import { z } from 'zod';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

const configSchema = z.object({
    // Bot configuration
    botToken: z.string().min(1, "BOT_TOKEN is required"),

    // DynamoDB tables
    tables: z.object({
        imageGenerationTask: z.string().min(1, "IMAGE_GENERATION_TASK_TABLE is required"),
    }),
    // S3 bucket
    botImagesBucket: z.string().min(1, "BOT_IMAGES_BUCKET is required"),
});

type Config = z.infer<typeof configSchema>;

function loadConfig(): Config {
    const config = {
        botToken: process.env.BOT_TOKEN,
        tables: {
            imageGenerationTask: process.env.IMAGE_GENERATION_TASK_TABLE,
        },
        botImagesBucket: process.env.BOT_IMAGES_BUCKET,
    };

    return configSchema.parse(config);
}

export const config = loadConfig();