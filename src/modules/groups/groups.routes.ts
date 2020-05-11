import { Router } from 'express';
import groupsController from './groups.controller';
import { createValidator } from '../../common/middlewares/create-validator';
import { createGroupDto, updateGroupDto } from './groups.dtos';

export const router: Router = Router();

/**
 * @swagger
 * /groups:
 *    get:
 *      tags:
 *          - Groups
 *      summary: Gets all groups.
 *      description: This request should return list of groups.
 *      responses:
 *        200:
 *          description: Array of groups.
 */
router.get('/', groupsController.findMany);

/**
 * @swagger
 * /group/:id:
 *    get:
 *      tags:
 *          - Groups
 *      summary: Returns group by id.
 *      description: This request should return a group by specified id.
 *      consumes:
 *        - application/json
 *      parameters:
 *        - id: integer
 *      responses:
 *        200:
 *          description: Single group.
 */
router.get('/:id', groupsController.findOne);

/**
 * @swagger
 * /groups:
 *    post:
 *      tags:
 *          - Groups
 *      summary: Creates a group.
 *      description: This request should create a group specified in body.
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: body
 *          in: body
 *          schema:
 *            groupName: string
 *            teacherId: number
 *            properties:
 *              groupName:
 *                  type: string
 *              teacherId:
 *                  type: number
 *      responses:
 *        200:
 *          description: Created group.
 */
router.post('/', createValidator(createGroupDto), groupsController.createOne);

/**
 * @swagger
 * /groups/:id:
 *    put:
 *      tags:
 *          - Groups
 *      summary: Update group with new data.
 *      description: Use any fields available in group model.
 *      consumes:
 *        - application/json
 *      responses:
 *        200:
 *          description: Updated group.
 */
router.put('/:id', createValidator(updateGroupDto), groupsController.updateOne);


/**
 * @swagger
 * /groups/:id:
 *    delete:
 *      tags:
 *          - Groups
 *      summary: Deletes group.
 *      description: Deletes group by specified ID.
 *      consumes:
 *        - application/json
 *      responses:
 *        201:
 *          description: Deleted group.
 */
router.delete('/:id', groupsController.deleteOne);
