import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';

export class AuthController {

    public async login(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await authService.login(req.body);
            res.json(result);
        } catch (e) {
            next(e);
        }
    }

    public async updatePassword(req: Request, res: Response, next: NextFunction) {
        try {
            const student = await authService.updatePassword(req.body);
            res.json(student);
        } catch (e) {
            next(e);
        }
    }

}
