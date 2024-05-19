import express, { Application, Response, Request } from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { NotFoundError } from './errors';
import { globalErrorHandler } from './middlewares/errorhandler.middleware';
import { authRouter } from './auth/auth.router';
import { taskRouter } from './task/task.router';

export const createApp = () => {
  const app: Application = express();

  app
    .use(morgan('dev'))
    .use(cookieParser())
    .use(express.json())
    .get('/healthz', (_req: Request, res: Response) => {
      return res.json({ ok: true });
    });

  // ROUTERS
  app.use('/api/auth', authRouter);
  app.use('/api/task', taskRouter);

  // NOT FOUND MIDDLEWARE
  app.all('*', () => {
    throw new NotFoundError();
  });

  // GLOBAL ERROR HANDLER
  app.use(globalErrorHandler);

  return app;
};
