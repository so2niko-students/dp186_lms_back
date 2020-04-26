import { CreateStudentsDto } from './students.dtos';
import { Router } from 'express';
import { studentsController } from './students.controller';
import { createValidator } from '../../common/middlewares/create-validator';
import { authJwt } from '../../common/middlewares/auth.middleware';
import { updateStudentsDto } from './students.dtos';

export const router: Router = Router();

router.post('/', createValidator(CreateStudentsDto), studentsController.createOne);
router.post('/:id', authJwt, createValidator(updateStudentsDto), studentsController.updateOne);
