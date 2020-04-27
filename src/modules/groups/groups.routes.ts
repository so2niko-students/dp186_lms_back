import { Router } from 'express';
import groupsController from './groups.controller';
import { createValidator } from '../../common/middlewares/create-validator';
import { createGroupDto, updateGroupDto } from './groups.dtos';

export const router: Router = Router();

router.get('/', groupsController.findMany);
router.get('/:id', groupsController.findOne);

router.post('/', createValidator(createGroupDto), groupsController.createOne);
router.post('/:id', createValidator(updateGroupDto), groupsController.updateOne);

router.delete('/:id', groupsController.deleteOne);
