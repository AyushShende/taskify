import express, { Application, Response, Request } from 'express';
import morgan from 'morgan';

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
    throw new Error('resource not found');
  });

  // GLOBAL ERROR HANDLER

  return app;
};
