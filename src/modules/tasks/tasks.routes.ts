import { Router } from 'express';
import { tasksController } from './tasks.controller';
import { createValidator } from '../../common/middlewares/create-validator';
import { createTaskDto, updateTaskDto } from './tasks.dtos';

export const router: Router = Router();


/**
 * @swagger
 * /tasks:
 *    get:
 *      tags:
 *          - Tasks
 *      summary: Get list of tasks.
 *      description: This route is made to get list of tasks.
 *      consumes:
 *        - application/json
 *      responses:
 *        200:
 *          description: Array of tasks.
 */
router.get('/', tasksController.findAll);


/**
 * @swagger
 * /tasks/:id:
 *    get:
 *      tags:
 *          - Tasks
 *      summary: Gets a task by id.
 *      description: This route is made to get a single teacher.
 *      consumes:
 *        - application/json
 *      responses:
 *        200:
 *          description: Get single task.
 */
router.get('/:id', tasksController.findOneById);

/**
 * @swagger
 * /tasks/:
 *    post:
 *      tags:
 *          - tasks
 *      summary: Creates a task
 *      description: This route is made to create a task.
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: body
 *          in: body
 *          schema:
 *            groupId: number
 *            taskName: string
 *            fileUrl: string
 *            properties:
 *              groupId:
 *                  type: number
 *              taskName:
 *                  type: string
 *              fileUrl:
 *                  type: string

 *      responses:
 *        200:
 *          description: Created task.
 */
router.post('/', createValidator(createTaskDto), tasksController.createOne);

/**
 * @swagger
 * /tasks/:id:
 *    put:
 *      tags:
 *          - tasks
 *      summary: Updates a task
 *      description: This route is made to update a task.
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: body
 *          in: body
 *          schema:
 *            groupId: number
 *            taskName: string
 *            fileUrl: string
 *            properties:
 *              groupId:
 *                  type: number
 *              taskName:
 *                  type: string
 *              fileUrl:
 *                  type: string

 *      responses:
 *        200:
 *          description: Updated task.
 */
router.put('/:id', createValidator(updateTaskDto), tasksController.updateOne);

/**
 * @swagger
 * /tasks/:id:
 *    delete:
 *      tags:
 *          - tasks
 *      summary: Creates a task
 *      description: This route is made to create a task.
 *      consumes:
 *        - application/json
 *      responses:
 *        200:
 *          description: Created task.
 */
router.delete('/:id', tasksController.deleteOne);
