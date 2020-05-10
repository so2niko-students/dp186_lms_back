import { Router } from 'express';
import { solutionsController } from './solutions.controller';
import { updateSolutionsDto } from './solutions.dtos';
import { createValidator } from '../../common/middlewares/create-validator';

export const router: Router = Router();

router.put('/:id', createValidator(updateSolutionsDto), solutionsController.updateOne);

