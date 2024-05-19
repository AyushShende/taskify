import { Router } from 'express';

import { asyncHandler } from './../utils/asyncHandler';
import { Authenticate } from '../middlewares/authenticate.middleware';
import { createTaskHandler, getTaskHandler } from './task.controller';
import { createTaskSchema, getTaskSchema } from './task.schema';
import { validate } from '../middlewares/validateRequest.middleware';

export const taskRouter: Router = Router();

taskRouter
  .route('/')
  .post(Authenticate, validate(createTaskSchema), asyncHandler(createTaskHandler));

taskRouter
  .route('/:taskId')
  .get(Authenticate, validate(getTaskSchema), asyncHandler(getTaskHandler));
