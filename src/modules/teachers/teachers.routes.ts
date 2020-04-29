import { Router } from 'express';
import { createValidator } from '../../common/middlewares/create-validator';
import { teachersController } from './teachers.controller';
import { updateTeachersDto } from './teachers.dtos';

export const router: Router = Router();

router.put('/:id', createValidator(updateTeachersDto), teachersController.updateOne);
