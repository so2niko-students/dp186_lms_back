import { Router } from 'express';
import { tasksController } from './tasks.controller';

export const router: Router = Router();

router.get('/', tasksController.findAll)

router.post('/', tasksController.createOne);

router.delete('/:id', tasksController.deleteOne);