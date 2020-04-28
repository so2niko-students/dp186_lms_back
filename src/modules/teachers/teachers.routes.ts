import { CreateTeachersDto } from './teachers.dtos';
import { Router } from 'express';
import { teachersController } from './teachers.controller';
import { createValidator } from '../../common/middlewares/create-validator';
import { authJwt } from '../../common/middlewares/auth.middleware';

export const router: Router = Router();

router.get('/', teachersController.findAllTeachers ); 

router.get('/:id', teachersController.findTeacherById ); 

router.post('/', authJwt, createValidator(CreateTeachersDto), teachersController.createOneTeacher ); 

router.delete('/:id', authJwt, teachersController.deleteOneById );
