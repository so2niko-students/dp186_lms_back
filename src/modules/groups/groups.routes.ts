import { Router } from 'express';
import groupsController from './groups.controller';

const router: Router = Router();

router.get('/', groupsController.findMany);
router.get('/:id', groupsController.findOne);

router.post('/', groupsController.createOne);
router.post('/:id', groupsController.updateOne);

router.delete('/:id', groupsController.deleteOne);
