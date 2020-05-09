import { Response, NextFunction } from 'express';
import { Comment} from './comments.model';
import { commentsService } from './comments.service';
import { AuthRequest } from '../../common/types/types';

class CommentsController {
    public async createOne(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const comment: Comment = await commentsService.createOne(req.body, req.user);
            res.statusCode = 201;
            res.send(comment);
        } catch (e) {
            next(e);
        }
    }
}

export const commentsController = new CommentsController();
