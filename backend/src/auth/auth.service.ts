import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { User } from '@prisma/client';

import { BadRequestError, UnAuthorizedError } from '../errors';
import { createUser, findUserByIdOrEmail } from '../user/user.service';
import { CreateUserInput, LoginUserInput } from './auth.schema';
import { env } from '../config/serverEnvSchema';
import { ActiveUserData, RefreshTokenPayload } from './auth.types';
import refreshTokenIdsStorage, {
  InvalidatedRefreshTokenError
} from '../utils/refreshTokenIdsStorage';

export const register = async (createUserInput: CreateUserInput) => {
  const user = await findUserByIdOrEmail({ email: createUserInput.email });
  if (user) {
    throw new BadRequestError('Invalid Credentials');
  }

  const hashedPassword = await bcrypt.hash(createUserInput.password, 10);

  const newUser = await createUser({
    ...createUserInput,
    password: hashedPassword
  });

  return await generateTokens(newUser);
};

const generateTokens = async (user: User) => {
  const refreshTokenId = randomUUID();
  const [access_token, refresh_token] = await Promise.all([
    signToken<Partial<ActiveUserData>>(user.id, env.JWT_ACCESS_TOKEN_TTL, {
      email: user.email
    }),
    signToken<Partial<RefreshTokenPayload>>(user.id, env.JWT_REFRESH_TOKEN_TTL, {
      refreshTokenId
    })
  ]);
  await refreshTokenIdsStorage.insert(user.id, refreshTokenId);
  return { access_token, refresh_token };
};

const signToken = async <T>(userId: string, expiresIn: number, payload?: T) => {
  return await jwt.sign(
    {
      sub: userId,
      ...payload
    },
    env.JWT_SECRET,
    {
      expiresIn
    }
  );
};

export const login = async (loginUserInput: LoginUserInput) => {
  const user = await findUserByIdOrEmail({ email: loginUserInput.email });
  if (!user) {
    throw new UnAuthorizedError('Invalid Credentials');
  }

  const validPassword = await bcrypt.compare(loginUserInput.password, user.password);
  if (!validPassword) {
    throw new UnAuthorizedError('Invalid Credentials');
  }

  return await generateTokens(user);
};

export const logout = async (userId: string) => {
  await refreshTokenIdsStorage.invalidate(userId);
};

export const refreshTokens = async (refreshToken: string) => {
  try {
    const { refreshTokenId, sub } = jwt.verify(refreshToken, env.JWT_SECRET) as RefreshTokenPayload;

    const user = await findUserByIdOrEmail({ userId: sub });
    if (!user) {
      throw new UnAuthorizedError('User does not exist');
    }

    const isValid = await refreshTokenIdsStorage.validate(user.id, refreshTokenId);
    if (isValid) {
      await refreshTokenIdsStorage.invalidate(user.id);
    } else {
      throw new UnAuthorizedError('Invalid token');
    }
    return await generateTokens(user);
  } catch (error) {
    if (error instanceof InvalidatedRefreshTokenError) {
      // Inform user about the possible theft of his refresh token
      throw new UnAuthorizedError('Access Denied');
    }
    throw new UnAuthorizedError('Invalid token');
  }
};
