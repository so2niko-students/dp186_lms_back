import { Router } from 'express';
import { commentsController } from './comments.controller';
import { createValidator } from '../../common/middlewares/create-validator';
import {createCommentDto} from '../comments/comments.dtos';

export const router: Router = Router();

router.post('/', createValidator(createCommentDto), commentsController.createOne);
router.get('/:id', commentsController.findAll);
