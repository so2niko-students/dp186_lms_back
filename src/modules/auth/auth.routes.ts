import { loginDto, updatePasswordDto } from './auth.dtos';
import { Router } from 'express';
import { AuthController } from './auth.controller';
import { createValidator } from '../../common/middlewares/create-validator';
import { authJwt } from '../../common/middlewares/auth.middleware';
import asyncHandler from "../../common/async.handler";

export class AuthRoute {

    public router: Router;
    public authController: AuthController = new AuthController();

    constructor() {
        this.router = Router();
        this.route();
    }

    public route() {
        /**
         * @swagger
         * /auth/login:
         *    post:
         *      tags:
         *          - Auth
         *      summary: Login
         *      description: User login to app
         *      consumes:
         *        - application/json
         *      parameters:
         *        - name: body
         *          in: body
         *          schema:
         *            email: string
         *            password: string
         *            properties:
         *              email:
         *                  type: string
         *              password:
         *                  type: string

         *      responses:
         *        200:
         *          description: Returns bearer token you can use in further requests.
         */
        this.router.post('/login', createValidator(loginDto), this.authController.login);

        /**
         * @swagger
         * /auth/change-password/student:
         *    put:
         *      tags:
         *          - Auth
         *      summary: Student password change
         *      description: Changes password to a student
         *      consumes:
         *        - application/json
         *      parameters:
         *        - in: header
         *          name: Authorization
         *          schema:
         *              type: string
         *          required: true
         *        - name: body
         *          in: body
         *          schema:
         *            oldPassword: string
         *            newPassword: string
         *            properties:
         *              oldPassword:
         *                  type: string
         *              newPassword:
         *                  type: string
         *      responses:
         *        200:
         *          description: Returns bearer token you can use in further requests.
         */
        this.router.put('/change-password/student', authJwt, createValidator(updatePasswordDto),
            this.authController.updateStudentPassword);

        /**
         * @swagger
         * /auth/change-password/teacher:
         *    put:
         *      tags:
         *          - Auth
         *      summary: Teacher password change
         *      description: Changes password to a teacher
         *      consumes:
         *        - application/json
         *      parameters:
         *        - in: header
         *          name: Authorization
         *          schema:
         *              type: string
         *          required: true
         *        - name: body
         *          in: body
         *          schema:
         *            oldPassword: string
         *            newPassword: string
         *            properties:
         *              oldPassword:
         *                  type: string
         *              newPassword:
         *                  type: string
         *      responses:
         *        200:
         *          description: Returns bearer token you can use in further requests.
         */
        this.router.put('/change-password/teacher', authJwt, createValidator(updatePasswordDto),
            this.authController.updateTeacherPassword);

        /**
         * @swagger
         * /auth/change-password/teacher/{id}:
         *    put:
         *      tags:
         *          - Auth
         *      summary: Teacher password change by SuperAdmin
         *      description: Changes password to a teacher by superadmin
         *      consumes:
         *        - application/json
         *      parameters:
         *        - in: header
         *          name: Authorization
         *          schema:
         *              type: string
         *          required: true
         *        - name: body
         *          in: body
         *          schema:
         *            oldPassword: string
         *            newPassword: string
         *            properties:
         *              oldPassword:
         *                  type: string
         *              newPassword:
         *                  type: string
         *      responses:
         *        200:
         *          description: Returns bearer token you can use in further requests.
         */
        this.router.put('/change-password/teacher/:id/', authJwt, createValidator(updatePasswordDto),
            this.authController.updateTeacherPasswordBySuperAdmin);

        /**
         * @swagger
         * /auth/forgotPassword:
         *    post:
         *      tags:
         *          - Auth
         *      summary: Request a change of password for your account
         *      description: Changes password to a teacher
         *      consumes:
         *        - application/json
         *      parameters:
         *        - name: body
         *          in: body
         *          schema:
         *            host: string
         *            email: string
         *            properties:
         *              host:
         *                  type: string
         *              email:
         *                  type: string
         *      responses:
         *        200:
         *          description: Requests password change for your account
         */
        this.router.post('/forgotPassword', asyncHandler(this.authController.forgotPassword));

        /**
         * @swagger
         * /auth/resetPassword/{token}:
         *    put:
         *      tags:
         *          - Auth
         *      summary: Teacher password change
         *      description: Changes password to a teacher
         *      consumes:
         *        - application/json
         *      parameters:
         *        - in: path
         *          name: token
         *          schema:
         *            type: string
         *          required: true
         *        - name: body
         *          in: body
         *          schema:
         *            email: string
         *            properties:
         *              password:
         *                  type: string
         *      responses:
         *        200:
         *          description: Updates your password to what you described
         */
        this.router.put('/resetPassword/:token', asyncHandler(this.authController.resetPassword));
    }
}
