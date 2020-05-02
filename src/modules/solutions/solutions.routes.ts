import { Router } from 'express';
import { solutionsController } from './solutions.controller';
import { Solution } from './solutions.model';
import { createSolutionsDto, updateSolutionsDto } from './solutions.dtos';
import { createValidator } from '../../common/middlewares/create-validator';
import {createGroupDto} from '../groups/groups.dtos';

export const router: Router = Router();

router.post('/', createValidator(createSolutionsDto), solutionsController.createOne);
router.post('/:id', createValidator(updateSolutionsDto), solutionsController.updateOne);

