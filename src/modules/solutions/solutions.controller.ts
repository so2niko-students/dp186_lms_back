import { Response, NextFunction } from 'express';
import { Solution} from './solutions.model';
import { solutionsService } from './solutions.service';
import { AuthRequest } from '../../common/types/types';
import {validateIdOrThrow} from '../../common/validators/';
import { IPaginationOuterData } from '../../common/interfaces/pagination.interfaces';

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

    public async getFullInfoById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const idNumb: number = validateIdOrThrow(req.params.id);
            const solution: IPaginationOuterData<Solution> = await solutionsService.getFullInfoById(idNumb, req.query);
            res.send(solution);
        } catch (e) {
            next(e);
        }
    }
}

export const solutionsController = new SolutionsController();
