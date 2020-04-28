import { Request, Response, NextFunction } from 'express';
import { teachersService } from './teachers.service';
import { Teachers } from './teachers.model';
import { UpdateRequest } from '../../common/types/types';
import { validateIdOrThrow } from '../../common/validators/';

class TeachersController {
    public async updateOne(req: UpdateRequest<Teachers>, res: Response,
                           next: NextFunction): Promise<void> {
        validateIdOrThrow(+req.params.id);
        try {
            const teacher =
                await teachersService.updateOne(+req.params.id, req.body, req.user);
            res.json(teacher);
        } catch (e) {
            next(e);
        }
    }
}

export const teachersController = new TeachersController();
