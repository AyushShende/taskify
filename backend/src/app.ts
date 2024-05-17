import express, { Application, Response, Request } from 'express';
import morgan from 'morgan';
import { NotFoundError } from './errors/NotFoundError';
import { globalErrorHandler } from './middlewares/errorhandler.middleware';

export const createApp = () => {
  const app: Application = express();

  app
    .use(morgan('dev'))
    .use(express.json())
    .get('/healthz', (_req: Request, res: Response) => {
      return res.json({ ok: true });
    });

  // ROUTERS

  // NOT FOUND MIDDLEWARE
  app.all('*', () => {
    throw new NotFoundError();
  });

  // GLOBAL ERROR HANDLER
  app.use(globalErrorHandler);

  return app;
};
