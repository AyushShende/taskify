import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { login, register } from './auth.service';

export const registerHandler = async (req: Request, res: Response) => {
  const { access_token, refresh_token } = await register(req.body);
  res.status(StatusCodes.CREATED).json({
    access_token,
    refresh_token
  });
};

export const loginHandler = async (req: Request, res: Response) => {
  const { access_token, refresh_token } = await login(req.body);
  res.status(StatusCodes.OK).json({
    access_token,
    refresh_token
  });
};
