import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import { createTask, deleteTask, getAllUserTasks, getTask, updateTask } from './task.service';
import {
  CreateTaskInput,
  DeleteTaskInput,
  GetAllUserTasksInput,
  GetTaskInput,
  UpdateTaskInput
} from './task.schema';
import { NotFoundError, UnAuthorizedError, ForbiddenError } from '../errors';

export const checkUserId = async (req: Request, _res: Response, next: NextFunction) => {
  const userId = req.userId;
  if (!userId) {
    throw new UnAuthorizedError();
  }
  const task = await getTask(req.params.taskId);
  if (!task) {
    throw new NotFoundError('Task does not exist');
  }
  if (task.authorId !== userId) {
    throw new ForbiddenError();
  }
  next();
};

export const createTaskHandler = async (req: Request<any, any, CreateTaskInput>, res: Response) => {
  const userId = req.userId as string;

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

export const updateTaskHandler = async (
  req: Request<UpdateTaskInput['params'], any, UpdateTaskInput['body']>,
  res: Response
) => {
  const updatedTask = await updateTask({
    body: req.body,
    params: req.params
  });

  res.status(StatusCodes.OK).json(updatedTask);
};

export const deleteTaskHandler = async (req: Request<DeleteTaskInput>, res: Response) => {
  await deleteTask(req.params.taskId);

  res.status(StatusCodes.NO_CONTENT).json();
};

export const getAllUserTasksHandler = async (
  req: Request<any, any, any, GetAllUserTasksInput>,
  res: Response
) => {
  const userId = req.userId as string;
  const tasks = await getAllUserTasks(userId, req.query);

  res.status(StatusCodes.OK).json(tasks);
};
