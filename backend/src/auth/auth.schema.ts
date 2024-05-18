import { object, string, TypeOf } from 'zod';

export const createUserSchema = object({
  body: object({
    name: string({
      required_error: 'Name is required'
    }).trim(),
    email: string({
      required_error: 'Email address is required'
    })
      .email('Invalid email address')
      .trim(),
    password: string({
      required_error: 'Password is required'
    })
      .min(8, 'Password must be more than 8 characters')
      .max(32, 'Password must be less than 32 characters')
      .trim()
  })
});

export const loginUserSchema = object({
  body: object({
    email: string({
      required_error: 'Email address is required'
    })
      .email('Invalid email address')
      .trim(),
    password: string({
      required_error: 'Password is required'
    }).trim()
  })
});

export type CreateUserInput = TypeOf<typeof createUserSchema>['body'];
export type LoginUserInput = TypeOf<typeof loginUserSchema>['body'];
