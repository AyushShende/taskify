import { NextFunction, Request, Response } from 'express';
import { UnAuthorizedError } from '../errors';
import { asyncHandler } from '../utils/asyncHandler';
import jwt from 'jsonwebtoken';
import { env } from '../config/serverEnvSchema';
import { findUserByIdOrEmail } from '../user/user.service';
import { ActiveUserData } from '../auth/auth.types';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const Authenticate: (req: Request, res: Response, next: NextFunction) => Promise<void> =
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.cookies?.access_token || req.headers.authorization?.split(' ')[1];

      if (!accessToken) {
        throw new UnAuthorizedError();
      }

      // Validate the token
      const decoded = jwt.verify(accessToken, env.JWT_SECRET) as ActiveUserData;

      if (!decoded) {
        throw new UnAuthorizedError('Invalid token or user does not exist');
      }

      const user = await findUserByIdOrEmail({ userId: decoded.sub });

      if (!user) {
        throw new UnAuthorizedError('Invalid token or user does not exist');
      }

      req.userId = user.id;

      next();
    } catch (error) {
      throw new UnAuthorizedError();
    }
  });
