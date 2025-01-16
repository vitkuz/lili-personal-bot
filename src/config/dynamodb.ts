import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { logger } from '../utils/logger';

export function createDynamoDBClient(): DynamoDBDocumentClient {
    const client = new DynamoDBClient({});
    logger.debug('Initializing DynamoDB client');
    return DynamoDBDocumentClient.from(client);
}