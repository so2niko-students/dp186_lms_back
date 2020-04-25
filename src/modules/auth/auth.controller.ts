import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { Students } from '../students/students.model';
import { Teachers } from '../teachers/teachers.model';
import { UpdateRequest } from '../../common/types/types';

interface IResult {
    token: string;
    expires: number;
}

export class AuthController {

    public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result: IResult = await authService.login(req.body);
            res.json(result);
        } catch (e) {
            next(e);
        }
    }

    public async updatePasswordStudent(req: UpdateRequest<Students>,
                                       res: Response, next: NextFunction)
    : Promise<void> {
        try {
            const user: Students  =
                await authService.updatePasswordStudent(req.body, req.user);
            res.json(user);
        } catch (e) {
            next(e);
        }
    }

    public async updatePasswordTeacher(req: UpdateRequest<Teachers>,
                                       res: Response, next: NextFunction)
    : Promise<void> {
        try {
            const user: Teachers =
                await authService.updatePasswordTeacher(req.body, req.user);
            res.json(user);
        } catch (e) {
            next(e);
        }
    }

    public async updatePasswordSuperAdmin(req: UpdateRequest<Teachers>,
                                          res: Response, next: NextFunction)
    : Promise<void> {
        try {
            const user: Teachers =
                await authService.updatePasswordSuperAdmin(+req.params.id, req.body, req.user);
            res.json(user);
        } catch (e) {
            next(e);
        }
    }

}
