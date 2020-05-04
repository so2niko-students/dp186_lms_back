import { Router } from 'express';
import { updateTeachersDto } from './teachers.dtos';
import { createValidator } from '../../common/middlewares/create-validator';
import { teachersController } from './teachers.controller';

export const router: Router = Router();

router.put('/:id', createValidator(updateTeachersDto), teachersController.updateOne);
