import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { Students } from '../students/students.model';
import { Teachers } from '../teachers/teachers.model';
import { UpdateRequest } from '../../common/types/types';
import * as HttpStatus from 'http-status-codes';
import asyncHandler from '../../common/async.handler';
import MailGun from '../../common/mailgun/MailGun';

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

    public forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
        const token: string = await authService.setResetToken(req.body.email);
        const resetLink = `https://${req.get('host')}/resetPassword/${token}`;
        const resetMessage = `You receive this email as you or someone else requested password change
        for your account. Please follow the next link to make it: ${resetLink}`;
        MailGun.fireMessage(req.body.email, resetMessage);

        res.status(HttpStatus.OK).json({
            msg: `User password change request is made. Check your mail for further instructions`
        });
    };

    public resetPassword = async (req: Request, res: Response, next: NextFunction) => {
        await authService.resetUserPassword(req.body.password, req.params.token);

        res.status(HttpStatus.OK).json({
            msg: `User password has been changed!`
        });
    };

    public async updateStudentPassword(req: UpdateRequest<Students>,
                                       res: Response, next: NextFunction)
    : Promise<void> {
        try {
            const user: Students  =
                await authService.updateStudentPassword(req.body, req.user);
            res.json(user);
        } catch (e) {
            next(e);
        }
    }

    public async updateTeacherPassword(req: UpdateRequest<Teachers>,
                                       res: Response, next: NextFunction)
    : Promise<void> {
        try {
            const user: Teachers =
                await authService.updateTeacherPassword(req.body, req.user);
            res.json(user);
        } catch (e) {
            next(e);
        }
    }

    public async updateTeacherPasswordBySuperAdmin(req: UpdateRequest<Teachers>,
                                                   res: Response, next: NextFunction)
    : Promise<void> {
        try {
            const user: Teachers =
                await authService.updateTeacherPasswordBySuperAdmin(+req.params.id,
                    req.body, req.user);
            res.json(user);
        } catch (e) {
            next(e);
        }
    }

}
