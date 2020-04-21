import { CreateStudentsDto } from './students.dtos';
import { Router } from 'express';
import { studentsController } from './students.controller';
import { createValidator } from '../../common/middlewares/create-validator';

export const router: Router = Router();

router.post('/', createValidator(CreateStudentsDto), studentsController.createOne);
