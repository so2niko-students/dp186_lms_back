import {AuthRequest} from '../../common/types/types';
import {NextFunction, Response} from 'express';
import {teachersService} from './teachers.service';

class TeachersController {
    public async updateOne(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const teacher = await teachersService.updateOneOrThrow(req.body, req.user);
            res.json(teacher);
        } catch (e) {
            next(e);
        }
    }
}

export const teachersController = new TeachersController();
