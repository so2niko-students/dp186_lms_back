import {createStudentsDto, updateStudentsDto} from './students.dtos';
import { Router } from 'express';
import { studentsController } from './students.controller';
import { createValidator } from '../../common/middlewares/create-validator';
import { authJwt } from '../../common/middlewares/auth.middleware';

export const router: Router = Router();

/**
 * @swagger
 * /students:
 *    post:
 *      tags:
 *          - Students
 *      summary: Creates a student.
 *      description: This request should create a student specified in body.
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: body
 *          in: body
 *          schema:
 *            groupName: string
 *            teacherId: number
 *            properties:
 *              firstNameUkr:
 *                  type: string
 *              lastNameUkr:
 *                  type: string
 *              firstNameEng:
 *                  type: string
 *              lastNameEng:
 *                  type: string
 *              password:
 *                  type: string
 *              passwordConfirmation:
 *                  type: string
 *              email:
 *                  type: string
 *              phoneNumber:
 *                  type: number
 *              groupToken:
 *                  type: string
 *      responses:
 *        200:
 *          description: Created student.
 */
router.post('/', createValidator(createStudentsDto), studentsController.createOne);

/**
 * @swagger
 * /students/{id}:
 *    put:
 *      tags:
 *          - Students
 *      summary: Updates a student.
 *      description: This request should update a student specified in body.
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: body
 *          in: body
 *          schema:
 *            groupName: string
 *            teacherId: number
 *            properties:
 *              firstNameUkr:
 *                  type: string
 *              lastNameUkr:
 *                  type: string
 *              firstNameEng:
 *                  type: string
 *              lastNameEng:
 *                  type: string
 *              email:
 *                  type: string
 *              phoneNumber:
 *                  type: number
 *      responses:
 *        200:
 *          description: Updated student.
 */
router.put('/:id', authJwt, createValidator(updateStudentsDto), studentsController.updateOne);
router.delete('/:id', authJwt, studentsController.deleteStudents);
