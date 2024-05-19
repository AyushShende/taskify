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

export const getTaskSchema = object({
  ...params
});

export type GetTaskInput = TypeOf<typeof getTaskSchema>['params'];

export type CreateTaskInput = TypeOf<typeof createTaskSchema>['body'];
