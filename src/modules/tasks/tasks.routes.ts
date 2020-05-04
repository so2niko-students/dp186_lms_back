import { Router } from 'express';
import { tasksController } from './tasks.controller';
import { createValidator } from '../../common/middlewares/create-validator';
import { createTaskDto, updateTaskDto } from './tasks.dtos';

export const router: Router = Router();

router.get('/', tasksController.findAll);
router.get('/:id', tasksController.findOneById);

router.post('/', createValidator(createTaskDto), tasksController.createOne);

router.put('/:id', createValidator(updateTaskDto), tasksController.updateOne);

router.delete('/:id', tasksController.deleteOne);
