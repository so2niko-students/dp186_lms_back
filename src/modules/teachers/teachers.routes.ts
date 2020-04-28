import { Router } from 'express';
import { createValidator } from '../../common/middlewares/create-validator';
import { authJwt } from '../../common/middlewares/auth.middleware';
import { teachersController } from './teachers.controller';
import { updateTeachersDto } from './teachers.dtos';

export const router: Router = Router();

router.put('/', authJwt, createValidator(updateTeachersDto), teachersController.updateOne);
