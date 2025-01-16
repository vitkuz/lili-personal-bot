#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { LiliPersonalBotStack } from '../lib/telegram-bot-stack';

const app = new cdk.App();
new LiliPersonalBotStack(app, 'LiliPersonalBotStack');