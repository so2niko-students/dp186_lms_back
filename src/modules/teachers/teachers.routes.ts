import { Router } from 'express';
import { teachersController } from './teachers.controller'

export const router: Router = Router();

router.get('/', teachersController.findAllTeachers ); 

router.get('/:id', teachersController.findTeacherById ); 

router.post('/', teachersController.createOneTeacher ); 

router.delete('/', teachersController.deleteOneById ); 
// router.post();
// router.delete();