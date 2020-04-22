import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { Students } from '../students/students.model';
import { Teachers } from '../teachers/teachers.model';
import { AuthRequest } from '../../common/types/types';

export class AuthController {

    public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result: object = await authService.login(req.body);
            res.json(result);
        } catch (e) {
            next(e);
        }
    }

    public async updatePassword(req: AuthRequest, res: Response, next: NextFunction)
    : Promise<void> {
        try {
            const user: Students | Teachers = await authService.updatePassword(req.body, req.user);
            res.json(user);
        } catch (e) {
            next(e);
        }
    }

}
