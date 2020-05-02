import { Comment } from '../comments/comments.model';
import { Request } from 'express';
import { NotFound, BadRequest, Unauthorized, Forbidden } from '../../common/exeptions/';
import { hashSync, genSaltSync } from 'bcrypt';
import { CustomUser, AuthRequest } from '../../common/types/types';
import {Tasks} from '../tasks/tasks.model';
import {Groups} from '../groups/groups.model';
import {groupsService} from '../groups/groups.service';
import { solutionsService } from '../solutions/solutions.service';
import { sequelize } from '../../database';
import {File} from '../files/files.model';
import {filesService} from '../files/files.service';
import {string} from 'joi';
import {Transaction} from 'sequelize';

interface ICommentCreate {
    solutionId: number;
    studentId?: number;
    teacherId?: number;
    text: string;
    fileLink?: string;
    fileNameExtension?:string
}

class CommentsService {

    // public async createOne(commentData: ICommentCreate, user:CustomUser, files): Promise<Comment> {
    public async createOne(commentData: ICommentCreate, user:CustomUser): Promise<Comment> {

        //Create transaction
        const transaction = await sequelize.transaction();

        const { isMentor } = user;
        const { solutionId, fileLink, fileNameExtension } = commentData;

        //нахожу по id - solution
        const solution = await solutionsService.findOneOrThrow(solutionId, transaction)

        //нахожу по id - таску
        const task = await Tasks.findOne({
            where: { id: solution.taskId }, transaction
        })

        // нахожу по id группу
        const group = await groupsService.findOneOrThrow(task.groupId, user, transaction);

        // проверяю, хватает ли прав у поль-лей для создания комментария
        if (isMentor && group.teacherId === user.id) {
            commentData.teacherId = user.id;
        } else if (solution.studentId === user.id) {
            commentData.studentId = user.id;
        } else {
            throw new Forbidden('You do not have rights to make comment');
        }

        const comment:Comment = await Comment.create(commentData, {transaction});

        if(fileLink && fileLink.length > 0) {

            const fileData = {fileLink, fileNameExtension, commentId:comment.id, taskId:task.id};
            const file: File = await filesService.createOne(fileData, transaction);
        }
        //await transaction.commit();
        return comment;
    }
}
export const commentsService = new CommentsService();

