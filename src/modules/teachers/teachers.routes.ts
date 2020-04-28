import { createTeachersDto, updateTeachersDto } from './teachers.dtos';
import { Router } from 'express';
import { teachersController } from './teachers.controller';
import { createValidator } from '../../common/middlewares/create-validator';
import { authJwt } from '../../common/middlewares/auth.middleware';

export const router: Router = Router();

router.get('/', teachersController.findAllTeachers ); 

router.get('/:id', teachersController.findTeacherById ); 

router.post('/', authJwt, createValidator(createTeachersDto), teachersController.createOneTeacher ); 

router.delete('/:id', authJwt, teachersController.deleteOneById );

router.put('/:id', authJwt , createValidator(updateTeachersDto), teachersController.updateOne);
