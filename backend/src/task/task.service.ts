import { CreateTaskInput, GetAllUserTasksInput, UpdateTaskInput } from './task.schema';
import { db } from '../utils/db';

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
  return db.task.findUnique({ where: { id: taskId } });
};

export const updateTask = async (updateTaskInput: UpdateTaskInput) => {
  return db.task.update({
    where: {
      id: updateTaskInput.params.taskId
    },
    data: updateTaskInput.body
  });
};

export const deleteTask = async (taskId: string) => {
  return db.task.delete({
    where: { id: taskId }
  });
};

export const getAllUserTasks = async (userId: string, queryString: GetAllUserTasksInput) => {
  if (queryString?.status) {
    return db.task.findMany({
      where: {
        authorId: userId,
        status: queryString.status
      }
    });
  }
  return db.task.findMany({
    where: {
      authorId: userId
    }
  });
};
