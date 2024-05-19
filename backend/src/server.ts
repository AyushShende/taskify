import 'dotenv/config';

import { createApp } from './app';
import { logger } from './utils/logger';
import { env } from './config/serverEnvSchema';

process.on('uncaughtException', err => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting Down...');
  logger.error(err.name, err.message);
  process.exit(1);
});

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(`api running on ${env.PORT}`);
});

process.on('unhandledRejection', (err: Error) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting Down...');
  logger.error(err.name, err.message);
  server.close(() => process.exit(1));
});
