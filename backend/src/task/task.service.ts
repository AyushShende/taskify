import { CreateTaskInput } from './task.schema';
import { db } from '../utils/db';

export const createTask = (createTaskInput: CreateTaskInput) => {
  return db.task.create({
    data: createTaskInput
  });
};
