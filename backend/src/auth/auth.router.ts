import { Router } from 'express';

import { asyncHandler } from '../utils/asyncHandler';
import { validate } from '../middlewares/validateRequest.middleware';
import { createUserSchema, loginUserSchema } from './auth.schema';
import { loginHandler, registerHandler } from './auth.controller';

export const authRouter: Router = Router();

authRouter.route('/register').post(validate(createUserSchema), asyncHandler(registerHandler));

authRouter.route('/login').post(validate(loginUserSchema), asyncHandler(loginHandler));
