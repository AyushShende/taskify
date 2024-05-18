import { NextFunction, Request, Response } from 'express';
import { register } from './auth.service';
import { StatusCodes } from 'http-status-codes';

export const registerHandler = async (req: Request, res: Response) => {
  const user = await register(req.body);
  res.status(StatusCodes.CREATED).json(user);
};
