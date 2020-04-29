import { NextFunction, Response } from 'express';
import { teachersService } from './teachers.service';
import { UpdateRequest } from '../../common/types/types';
import { validateIdOrThrow } from '../../common/validators/';
import { Teachers } from './teachers.model';

class TeachersController {
    public async updateOne(req: UpdateRequest<Teachers>, res: Response, next: NextFunction) {
        try {
            validateIdOrThrow(+req.params.id);
            const teacher = await teachersService.updateOneOrThrow(+req.params.id,
                req.body, req.user);
            res.json(teacher);
        } catch (e) {
            next(e);
        }
    }
}

export const teachersController = new TeachersController();
