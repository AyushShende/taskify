import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { BaseError } from '../errors/BaseError';
import { logger } from '../utils/logger';
import { env } from '../config/serverEnvSchema';

export const globalErrorHandler: ErrorRequestHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof BaseError) {
    return res.status(err.StatusCode).send({ errors: err.serializeErrors() });
  }

  env.NODE_ENV === 'development' && logger.error(err);
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
    errors: [{ message: 'Something went wrong' }]
  });
};
