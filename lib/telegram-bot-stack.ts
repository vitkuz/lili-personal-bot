import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import { config } from 'dotenv';

config();

export class LiliPersonalBotStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // const { botTokenValue } = loadEnvVariables();

    const layer = new lambda.LayerVersion(this, 'SharedModules', {
      code: lambda.Code.fromAsset('lambda-layer'),
      compatibleRuntimes: [lambda.Runtime.NODEJS_20_X],
      description: 'Shared modules and dependencies for Telegram bot',
    });

    const existingSecret = secretsmanager.Secret.fromSecretNameV2(this, 'ExistingBotToken', 'lili-personal-bot-token');

    // Retrieve the secret value as needed
    const botTokenValue = existingSecret.secretValue.unsafeUnwrap();

    const imageGenerationTaskTable = new dynamodb.Table(this, 'ImageGenerationTaskTable', {
      partitionKey: { name: 'predictionId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      timeToLiveAttribute: 'ttl',
    });

    // Create S3 bucket for bot images
    const botImagesBucket = new s3.Bucket(this, 'BotImagesBucket', {
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
      publicReadAccess: true,
      blockPublicAccess: {
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      }
    });
    // Lambda Function
    const botHandler = new lambda.Function(this, 'TelegramBotHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      layers: [layer],
      code: lambda.Code.fromAsset('src'),
      timeout: cdk.Duration.seconds(30),
      logRetention: logs.RetentionDays.ONE_DAY,
      environment: {
        IMAGE_GENERATION_TASK_TABLE: imageGenerationTaskTable.tableName,
        BOT_TOKEN: botTokenValue,
        BOT_IMAGES_BUCKET: botImagesBucket.bucketName,
      },
    });

    // Task Handler Lambda
    const taskHandler = new lambda.Function(this, 'TaskHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'handlers/task/index.handler',
      layers: [layer],
      code: lambda.Code.fromAsset('src'),
      timeout: cdk.Duration.seconds(900),
      logRetention: logs.RetentionDays.ONE_DAY,
      environment: {
        IMAGE_GENERATION_TASK_TABLE: imageGenerationTaskTable.tableName,
        BOT_TOKEN: botTokenValue,
        BOT_IMAGES_BUCKET: botImagesBucket.bucketName,
      },
    });

    // Grant DynamoDB permissions to Lambda
    imageGenerationTaskTable.grantReadWriteData(botHandler);
    imageGenerationTaskTable.grantReadWriteData(taskHandler);
    botImagesBucket.grantReadWrite(taskHandler);

    // Add DynamoDB Stream trigger to Task Handler
    taskHandler.addEventSourceMapping('TaskTableTrigger', {
      eventSourceArn: imageGenerationTaskTable.tableStreamArn!,
      startingPosition: lambda.StartingPosition.LATEST,
      batchSize: 1,
      retryAttempts: 3
    });

    // API Gateway
    const telegramBotApi = new apigateway.RestApi(this, 'TelegramBotApi', {
      restApiName: 'Telegram Bot API',
    });

    ///-----------------------

    const integration = new apigateway.LambdaIntegration(botHandler);
    telegramBotApi.root.addMethod('POST', integration);

    // Output the API URL
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: telegramBotApi.url,
      description: 'API Gateway URL for Telegram webhook',
    });

    new cdk.CfnOutput(this, 'TelegramBotApiOutput', {
      value: telegramBotApi.url,
      description: 'API Gateway URL for Telegram webhook',
    });

    new cdk.CfnOutput(this, 'ImageGenerationTaskTableOutput', {
      value: imageGenerationTaskTable.tableName,
      description: 'Image Generation Task table name',
    });

    new cdk.CfnOutput(this, 'BotImagesBucketOutput', {
      value: botImagesBucket.bucketName,
      description: 'Bot Images bucket name',
    });

  }
}