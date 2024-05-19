import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { createTask } from './task.service';

export const createTaskHandler = async (req: Request, res: Response) => {
  const task = await createTask(req.body);
  res.status(StatusCodes.CREATED).json(task);
};
