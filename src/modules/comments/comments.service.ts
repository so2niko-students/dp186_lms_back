import { Comment } from '../comments/comments.model';
import { Forbidden } from '../../common/exeptions/';
import { CustomUser } from '../../common/types/types';
import { sequelize } from '../../database';
import { File } from '../files/files.model';
import { filesService } from '../files/files.service';
import { tasksService } from '../tasks/tasks.service';
import {ISolutionCreate, solutionsService} from '../solutions/solutions.service';
import { ICreateGroup, groupsService } from '../groups/groups.service';
import { Tasks } from '../tasks/tasks.model';
import {ICommentCreate} from '../../common/interfaces/comments.interfaces';

class CommentsService {

    public async createOne(commentData: ICommentCreate, user:CustomUser): Promise<Comment> {

        console.log('user = ', user);
        return sequelize.transaction(async transaction => {

            const { isMentor } = user;
            const { solutionId, fileLink, fileNameExtension } = commentData;

            //нахожу по id - solution
            const solution: ISolutionCreate = await solutionsService.findOneOrThrow(solutionId, transaction)

            //нахожу по id - таску
            const task: Tasks = await tasksService.findOneById(solution.taskId, user, transaction)

            // нахожу по id группу
            const group: ICreateGroup = await groupsService.findOneOrThrow(task.groupId, user, transaction);

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

                const fileData = {fileLink, fileNameExtension, commentId:comment.id};
                const file: File = await filesService.createOne(fileData, transaction);
            }

            return comment;
        })
    }
}
export const commentsService = new CommentsService();
