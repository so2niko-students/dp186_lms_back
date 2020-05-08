import {createStudentsDto, updateStudentsDto} from './students.dtos';
import { Router } from 'express';
import { studentsController } from './students.controller';
import { createValidator } from '../../common/middlewares/create-validator';
import { authJwt } from '../../common/middlewares/auth.middleware';

export const router: Router = Router();

router.post('/', createValidator(createStudentsDto), studentsController.createOne);
router.delete('/:id', authJwt, studentsController.deleteStudents);
router.put('/:id', authJwt, createValidator(updateStudentsDto), studentsController.updateOne);
