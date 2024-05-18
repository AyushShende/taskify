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
  DATABASE_URL: z.string(),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_HOST: z.string(),
  JWT_SECRET: z.string(),
  JWT_ACCESS_TOKEN_TTL: z.coerce.number(),
  JWT_REFRESH_TOKEN_TTL: z.coerce.number()
});

const envServer = envSchema.safeParse(process.env);

if (!envServer.success) {
  logger.error(envServer.error.issues);
  throw new Error('There is an error with the server environment variables');
}

export const env = envServer.data;
