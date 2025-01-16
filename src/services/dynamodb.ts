import {PutCommand, UpdateCommand, UpdateCommandInput} from '@aws-sdk/lib-dynamodb';
import { config } from '../config';
import { createDynamoDBClient } from '../config/dynamodb';
import { logger } from '../utils/logger';

const docClient = createDynamoDBClient();
