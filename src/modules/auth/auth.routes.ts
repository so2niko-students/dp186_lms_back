import { loginDto, updatePasswordDto } from './auth.dtos';
import { Router } from 'express';
import { AuthController } from './auth.controller';
import { createValidator } from '../../common/middlewares/create-validator';
import { authJwt } from '../../common/middlewares/auth.middleware';

export class AuthRoute {

    public router: Router;
    public authController: AuthController = new AuthController();

    constructor() {
        this.router = Router();
        this.route();
    }

    public route() {
        this.router.post('/login', createValidator(loginDto), this.authController.login);
        this.router.put('/change-password/student', authJwt, createValidator(updatePasswordDto),
            this.authController.updateStudentPassword);
        this.router.put('/change-password/teacher', authJwt, createValidator(updatePasswordDto),
            this.authController.updateTeacherPassword);
        this.router.put('/change-password/teacher/:id', authJwt, createValidator(updatePasswordDto),
            this.authController.updateTeacherPasswordBySuperAdmin);
    }
}
