import { LoginDto } from './auth.dtos';
import { Router } from 'express';
import { AuthController } from './auth.controller';
import { createValidator } from '../../common/middlewares/create.validation';

export class authRoute {

    router: Router;
    public authController: AuthController = new AuthController()

    constructor() {
        this.router = Router();
        this.route();
    }

    route() {
        this.router.post('/login', createValidator(LoginDto), this.authController.login);
    }
}
