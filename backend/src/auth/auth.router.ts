import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { validate } from '../middlewares/validateRequest.middleware';
import { createUserSchema } from './auth.schema';
import { registerHandler } from './auth.controller';

export const authRouter: Router = Router();

authRouter.route('/register').post(validate(createUserSchema), asyncHandler(registerHandler));
