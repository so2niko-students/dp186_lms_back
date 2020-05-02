import { Request, Response, NextFunction } from 'express';
import { Solution} from './solutions.model';
import { solutionsService } from './solutions.service';
import { AuthRequest } from '../../common/types/types';

class SolutionsController {
    public async createOne(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const solution: Solution[] = await solutionsService.createSolution(req.body, req.user);
            // console.log('from solution controller  req.body = ', req.body);
            // console.log('from solution controller  req.user = ', req.user);
            res.statusCode = 201;
            res.send(solution);
        } catch (e) {
            next(e);
        }
    }
    public async updateOne(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const solution: Solution = await solutionsService.updateOne(+req.params.id, req.body, req.user);
            res.statusCode = 201;
            res.send(solution);
        } catch (e) {
            next(e);
        }
    }
}

export const solutionsController = new SolutionsController();
