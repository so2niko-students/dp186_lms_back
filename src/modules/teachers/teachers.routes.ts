import { createTeachersDto, updateTeachersDto } from './teachers.dtos';
import { Router } from 'express';
import { teachersController } from './teachers.controller';
import { createValidator } from '../../common/middlewares/create-validator';
import { authJwt } from '../../common/middlewares/auth.middleware';

export const router: Router = Router();

/**
 * @swagger
 * /teachers:
 *    get:
 *      tags:
 *          - Teachers
 *      summary: Get list of teachers.
 *      description: This request should get list of teachers.
 *      consumes:
 *        - application/json
 *      responses:
 *        200:
 *          description: Array of teachers.
 */
router.get('/', teachersController.findAll );

/**
 * @swagger
 * /teachers/{id}:
 *    get:
 *      tags:
 *          - Teachers
 *      summary: Gets a teacher by id.
 *      description: This route is made to get a single teacher.
 *      consumes:
 *        - application/json
 *      responses:
 *        200:
 *          description: Get list of teachers.
 */
router.get('/:id', teachersController.findById );

/**
 * @swagger
 * /teachers/:
 *    post:
 *      tags:
 *          - Teachers
 *      summary: Creates a new teacher.
 *      description: This route is made to get a single teacher.
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
 *            groupName: string
 *            teacherId: number
 *            properties:
 *              firstName:
 *                  type: string
 *              lastName:
 *                  type: number
 *              email:
 *                  type: number
 *              password:
 *                  type: number
 *      responses:
 *        200:
 *          description: Returns teacher you have just created.
 */
router.post('/', authJwt, createValidator(createTeachersDto), teachersController.createOne );


/**
 * @swagger
 * /teachers/{id}:
 *    delete:
 *      tags:
 *          - Teachers
 *      summary: Deletes a teacher by id.
 *      description: This route is made to delete a single teacher.
 *      consumes:
 *        - application/json
 *      responses:
 *        201:
 *          description: deleted teacher.
 */
router.delete('/:id', authJwt, teachersController.deleteOneById );

/**
 * @swagger
 * /teachers/:
 *    post:
 *      tags:
 *          - Teachers
 *      summary: Gets a teacher by id.
 *      description: This route is made to get a single teacher.
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
 *            groupName: string
 *            teacherId: number
 *            properties:
 *              firstName:
 *                  type: string
 *              lastName:
 *                  type: number
 *              email:
 *                  type: number
 *      responses:
 *        200:
 *          description: Get list of teachers.
 */
router.put('/:id', authJwt , createValidator(updateTeachersDto), teachersController.updateOne);
