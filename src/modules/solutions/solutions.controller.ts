import { Response, NextFunction } from 'express';
import { Solution} from './solutions.model';
import { solutionsService } from './solutions.service';
import { AuthRequest } from '../../common/types/types';
import {validateIdOrThrow} from '../../common/validators/';

class SolutionsController {
    public async updateOne(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            validateIdOrThrow(+req.params.id);
            const solution: Solution = await solutionsService.updateOneOrThrow(+req.params.id, req.body, req.user);
            res.send(solution);
        } catch (e) {
            next(e);
        }
    }
}

export const solutionsController = new SolutionsController();
