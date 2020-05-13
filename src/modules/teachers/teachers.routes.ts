import { createTeachersDto, updateTeachersDto, findAllTeachersDto } from './teachers.dtos';
import { Router } from 'express';
import { teachersController } from './teachers.controller';
import { createValidator} from '../../common/middlewares/create-validator';
import { authJwt } from '../../common/middlewares/auth.middleware';

export const router: Router = Router();

router.get('/', createValidator(findAllTeachersDto, 'query'), teachersController.findAll ); 

router.get('/:id', teachersController.findById ); 

router.post('/', authJwt, createValidator(createTeachersDto), teachersController.createOne ); 

router.delete('/:id', authJwt, teachersController.deleteOneById );

router.put('/:id', authJwt , createValidator(updateTeachersDto), teachersController.updateOne);
