import { Router } from 'express';
import { tasksController } from './tasks.controller';
import { createValidator } from "../../common/middlewares/create-validator";

export const router: Router = Router();

router.get('/', tasksController.findByGroup)
router.get('/:id', tasksController.findOneById)

router.post('/', tasksController.createOne);

router.put('/:id', tasksController.updateOne)

router.delete('/:id', tasksController.deleteOne);