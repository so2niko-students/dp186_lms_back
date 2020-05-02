import { Request, Response, NextFunction } from 'express';
import { Comment} from './comments.model';
import { File } from '../files/files.model'
import { commentsService } from './comments.service';
import { AuthRequest } from '../../common/types/types';
import {filesService} from '../files/files.service';

class CommentsController {
    public async createOne(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const comment: Comment = await commentsService.createOne(req.body, req.user);
            // console.log('from solution controller  req.body = ', req.body);
            // console.log('from solution controller  req.user = ', req.user);
            res.statusCode = 201;
            res.send(comment);


        } catch (e) {
            next(e);
        }
    }
}

export const commentsController = new CommentsController();
