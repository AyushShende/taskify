import { CreateTaskInput, GetTaskInput } from './task.schema';
import { db } from '../utils/db';
import { Request } from 'express';
import { NotFoundError } from '../errors';

export const createTask = async (createTaskInput: CreateTaskInput & { userId: string }) => {
  const { description, title, status, userId } = createTaskInput;
  return db.task.create({
    data: {
      title,
      description,
      status,
      authorId: userId
    }
  });
};

export const getTask = async (taskId: string) => {
  const task = await db.task.findUnique({ where: { id: taskId } });

  if (!task) {
    throw new NotFoundError('Task does not exist');
  }
  return task;
};
