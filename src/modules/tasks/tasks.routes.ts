import { Router } from 'express';
import { tasksController } from './tasks.controller';

export const router: Router = Router();

router.get('/', tasksController.findAll)
router.get('/:id', tasksController.findOneById)

router.post('/', tasksController.createOne);

router.put('/:id', tasksController.updateOne)

router.delete('/:id', tasksController.deleteOne);