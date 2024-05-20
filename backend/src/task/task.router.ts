import { Router } from 'express';

import { asyncHandler } from './../utils/asyncHandler';
import { Authenticate } from '../middlewares/authenticate.middleware';
import {
  checkUserId,
  createTaskHandler,
  deleteTaskHandler,
  getAllUserTasksHandler,
  getTaskHandler,
  updateTaskHandler
} from './task.controller';
import {
  createTaskSchema,
  deleteTaskSchema,
  getAllUserTasksSchema,
  getTaskSchema,
  updateTaskSchema
} from './task.schema';
import { validate } from '../middlewares/validateRequest.middleware';

export const taskRouter: Router = Router();

taskRouter
  .route('/')
  .get(Authenticate, validate(getAllUserTasksSchema), asyncHandler(getAllUserTasksHandler))
  .post(Authenticate, validate(createTaskSchema), asyncHandler(createTaskHandler));

taskRouter
  .route('/:taskId')
  .get(
    Authenticate,
    validate(getTaskSchema),
    asyncHandler(checkUserId),
    asyncHandler(getTaskHandler)
  )
  .patch(
    Authenticate,
    validate(updateTaskSchema),
    asyncHandler(checkUserId),
    asyncHandler(updateTaskHandler)
  )
  .delete(
    Authenticate,
    validate(deleteTaskSchema),
    asyncHandler(checkUserId),
    asyncHandler(deleteTaskHandler)
  );
