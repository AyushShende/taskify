import z from 'zod';
import { logger } from '../utils/logger';

const envSchema = z.object({
  PORT: z.coerce.number().default(8000),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  POSTGRES_HOST: z.string(),
  POSTGRES_PORT: z.coerce.number().default(5432),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
  DATABASE_URL: z.string()
});

const envServer = envSchema.safeParse(process.env);

if (!envServer.success) {
  logger.error(envServer.error.issues);
  throw new Error('There is an error with the server environment variables');
}

export const env = envServer.data;
