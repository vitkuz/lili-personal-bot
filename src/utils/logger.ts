type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const emojis = {
  info: '📝',
  warn: '⚠️',
  error: '❌',
  debug: '🔍',
  user: '👤',
  auth: '🔑',
  payment: '💰',
  start: '🚀',
  db: '💾',
};

function formatMessage(level: LogLevel, message: string, context?: Record<string, any>) {
  const timestamp = new Date().toISOString();
  const emoji = emojis[level];
  const contextStr = context ? `\n${JSON.stringify(context, null, 2)}` : '';
  
  return `${emoji} [${timestamp}] ${message}${contextStr}`;
}

export const logger = {
  info: (message: string, context?: Record<string, any>) => {
    console.log(formatMessage('info', message, context));
  },
  warn: (message: string, context?: Record<string, any>) => {
    console.warn(formatMessage('warn', message, context));
  },
  error: (message: string, error?: Error, context?: Record<string, any>) => {
    console.error(formatMessage('error', message, {
      ...context,
      error: error?.message,
      stack: error?.stack,
    }));
  },
  debug: (message: string, context?: Record<string, any>) => {
    if (process.env.DEBUG) {
      console.debug(formatMessage('debug', message, context));
    }
  },
  user: (message: string, userId: string, context?: Record<string, any>) => {
    console.log(formatMessage('info', `${emojis.user} [User ${userId}] ${message}`, context));
  },
  payment: (message: string, userId: string, context?: Record<string, any>) => {
    console.log(formatMessage('info', `${emojis.payment} [User ${userId}] ${message}`, context));
  },
};