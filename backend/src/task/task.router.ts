import { Router } from 'express';

import { asyncHandler } from './../utils/asyncHandler';
import { Authenticate } from '../middlewares/authenticate.middleware';
import { createTaskHandler } from './task.controller';
import { createTaskSchema } from './task.schema';
import { validate } from '../middlewares/validateRequest.middleware';

export const taskRouter: Router = Router();

taskRouter
  .route('/')
  .post(Authenticate, validate(createTaskSchema), asyncHandler(createTaskHandler));
