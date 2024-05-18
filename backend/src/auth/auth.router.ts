import { Router } from 'express';

import { asyncHandler } from '../utils/asyncHandler';
import { validate } from '../middlewares/validateRequest.middleware';
import { createUserSchema, loginUserSchema } from './auth.schema';
import { loginHandler, logoutHandler, registerHandler } from './auth.controller';
import { Authenticate } from '../middlewares/authenticate.middleware';

export const authRouter: Router = Router();

authRouter.route('/register').post(validate(createUserSchema), asyncHandler(registerHandler));

authRouter.route('/login').post(validate(loginUserSchema), asyncHandler(loginHandler));

authRouter.route('/logout').post(Authenticate, asyncHandler(logoutHandler));
