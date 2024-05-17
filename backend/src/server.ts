import 'dotenv/config';

import { createApp } from './app';
import { logger } from './utils/logger';
import { env } from './config/serverEnvSchema';

const app = createApp();

app.listen(env.PORT, () => {
  logger.info(`api running on ${env.PORT}`);
});
