import { CreateUserInput } from './../auth/auth.schema';
import { db } from '../utils/db';

export const createUser = async (createUserInput: CreateUserInput) => {
  return db.user.create({
    data: createUserInput
  });
};

export const findUserByIdOrEmail = async ({
  userId,
  email
}: {
  userId?: string;
  email?: string;
}) => {
  return db.user.findFirst({
    where: {
      OR: [
        {
          id: userId
        },
        {
          email
        }
      ]
    }
  });
};
