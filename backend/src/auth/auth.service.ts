import bcrypt from 'bcrypt';

import { BadRequestError } from '../errors/BadRequestError';
import { createUser, findUserByIdOrEmail } from '../user/user.service';
import { CreateUserInput } from './auth.schema';

export const register = async (createUserInput: CreateUserInput) => {
  const user = await findUserByIdOrEmail({ email: createUserInput.email });
  if (user) {
    throw new BadRequestError('User already exists');
  }

  const hashedPassword = await bcrypt.hash(createUserInput.password, 10);

  const newUser = await createUser({
    ...createUserInput,
    password: hashedPassword
  });

  return newUser;
};
