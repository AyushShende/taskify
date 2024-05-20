import { nativeEnum, object, string, TypeOf } from 'zod';

export enum TaskStatusEnumType {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed'
}

export const createTaskSchema = object({
  body: object({
    title: string({
      required_error: 'title is required'
    })
      .min(1)
      .trim(),
    description: string().optional(),
    status: nativeEnum(TaskStatusEnumType).default(TaskStatusEnumType.PENDING)
  })
});

const params = {
  params: object({
    taskId: string()
  })
};

export const getAllUserTasksSchema = object({
  query: object({
    status: nativeEnum(TaskStatusEnumType).optional()
  }).optional()
});

export const getTaskSchema = object({
  ...params
});

export const updateTaskSchema = object({
  ...params,
  body: object({
    title: string(),
    description: string(),
    status: nativeEnum(TaskStatusEnumType)
  }).partial()
});

export const deleteTaskSchema = object({
  ...params
});

export type GetTaskInput = TypeOf<typeof getTaskSchema>['params'];

export type GetAllUserTasksInput = TypeOf<typeof getAllUserTasksSchema>['query'];

export type CreateTaskInput = TypeOf<typeof createTaskSchema>['body'];

export type UpdateTaskInput = TypeOf<typeof updateTaskSchema>;

export type DeleteTaskInput = TypeOf<typeof deleteTaskSchema>['params'];
