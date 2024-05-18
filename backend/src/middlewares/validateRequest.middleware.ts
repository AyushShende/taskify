import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

import { RequestValidationError } from '../errors';

export const validate =
  (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        params: req.params,
        query: req.query,
        body: req.body
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(new RequestValidationError(error.issues));
      }
      next(error);
    }
  };
