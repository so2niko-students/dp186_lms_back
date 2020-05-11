import { Response, NextFunction } from 'express';
import { Comment} from './comments.model';
import { commentsService } from './comments.service';
import { AuthRequest } from '../../common/types/types';
import { validateIdOrThrow } from '../../common/validators/';
import { IPaginationOuterData } from '../../common/interfaces/pagination.interfaces';

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

    public async findBySolutionId(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
      try {
        const idNumb: number = validateIdOrThrow(req.params.solutionId);
        const comments: IPaginationOuterData<Comment> = await commentsService.findBySolutionId(idNumb, req.query);
        res.send(comments);
      } catch (e) {
        next(e);
      }
    }
}

export const commentsController = new CommentsController();
