import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { login, logout, refreshTokens, register } from './auth.service';
import { env } from '../config/serverEnvSchema';
import { UnAuthorizedError } from '../errors';
import { CreateUserInput, LoginUserInput } from './auth.schema';

const cookieOptions = {
  httpOnly: true,
  sameSite: true,
  secure: env.NODE_ENV !== 'development'
};

export const registerHandler = async (req: Request<any, any, CreateUserInput>, res: Response) => {
  const { access_token, refresh_token } = await register(req.body);
  res.cookie('access_token', access_token, cookieOptions);
  res.cookie('refresh_token', refresh_token, cookieOptions);
  res.status(StatusCodes.CREATED).json();
};

export const loginHandler = async (req: Request<any, any, LoginUserInput>, res: Response) => {
  const { access_token, refresh_token } = await login(req.body);
  res.cookie('access_token', access_token, cookieOptions);
  res.cookie('refresh_token', refresh_token, cookieOptions);
  res.status(StatusCodes.OK).json();
};

export const logoutHandler = async (req: Request, res: Response) => {
  await logout(req.userId as string);
  res.clearCookie('access_token', cookieOptions);
  res.clearCookie('refresh_token', cookieOptions);
  res.status(StatusCodes.OK).json({
    message: 'user logged out successfully'
  });
};

export const refreshTokensHandler = async (req: Request, res: Response) => {
  const refreshToken: string = req.cookies.refresh_token;
  if (!refreshToken) {
    throw new UnAuthorizedError();
  }
  const { access_token, refresh_token } = await refreshTokens(refreshToken);
  res.cookie('access_token', access_token, cookieOptions);
  res.cookie('refresh_token', refresh_token, cookieOptions);
  res.status(StatusCodes.OK).json();
};
