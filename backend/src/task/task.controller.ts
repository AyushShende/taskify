import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { createTask, getTask } from './task.service';
import { CreateTaskInput, GetTaskInput } from './task.schema';
import { UnAuthorizedError } from '../errors';

export const createTaskHandler = async (req: Request<any, any, CreateTaskInput>, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    throw new UnAuthorizedError();
  }

  const task = await createTask({
    ...req.body,
    userId
  });

  res.status(StatusCodes.CREATED).json(task);
};

export const getTaskHandler = async (req: Request<GetTaskInput>, res: Response) => {
  const task = await getTask(req.params.taskId);
  res.status(StatusCodes.OK).json(task);
};
