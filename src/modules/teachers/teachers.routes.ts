import { CreateTeachersDto } from './teachers.dtos';
import { Router } from 'express';
import { teachersController } from './teachers.controller';
import { createValidator } from '../../common/middlewares/create-validator';

export const router: Router = Router();

router.get('/', teachersController.findAllTeachers ); 

router.get('/:id', teachersController.findTeacherById ); 

router.post('/', createValidator(CreateTeachersDto), teachersController.createOneTeacher ); 

router.delete('/', teachersController.deleteOneById );
// router.post();
// router.delete();