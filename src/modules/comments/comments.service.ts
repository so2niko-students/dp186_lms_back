import { Comment } from '../comments/comments.model';
import { Forbidden } from '../../common/exeptions/';
import { CustomUser } from '../../common/types/types';
import { sequelize } from '../../database';
import { File } from '../files/files.model';
import { filesService } from '../files/files.service';
import { tasksService } from '../tasks/tasks.service';
import {ISolutionCreate, solutionsService} from '../solutions/solutions.service';
import { ICreateGroup, groupsService } from '../groups/groups.service';
import { Teachers as Teacher } from '../teachers/teachers.model';
import { Students as Student } from '../students/students.model';
import { Avatars as Avatar } from '../avatars/avatars.model';
import { Tasks } from '../tasks/tasks.model';
import { Transaction } from 'sequelize/types';

interface ICommentCreate {
    solutionId: number;
    studentId?: number;
    teacherId?: number;
    text: string;
    fileLink?: string;
    fileNameExtension?:string
}

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

    public async findOneBySolutionId(solutionId: number, transaction?: Transaction): Promise<Comment> {
      return await Comment.findOne({ where: { solutionId }, transaction })
    }

    public async countComments(solutionId: number, transaction?: Transaction): Promise<number> {
      return await Comment.count({ where: { solutionId }, transaction })
    } 

    public async findBySolutionId(solutionId: number, query) {
      const offset: number = parseInt(query.offset) || 0;
      const limit: number = parseInt(query.limit) || 20;
      
      return sequelize.transaction(async (transaction) => {
        const total = await this.countComments(solutionId, transaction);

        const comments: Comment[] = await Comment.findAll({ where: { solutionId }, offset, limit, include: [{ 
          model: Student, as: 'student', attributes: ['firstNameEng', 'lastNameEng'], include: [{ 
            model: Avatar, as: 'avatar', attributes: ['avatarLink'] 
          }] 
          }, { 
            model: Teacher, as: 'teacher' , attributes: ['firstName', 'lastName'], include: [{ 
              model: Avatar, as: 'avatar', attributes: ['avatarLink'] 
            }] 
          }, { 
            model: File, as: 'files', attributes: ['fileLink'] 
          }], 
          transaction
        })

        return {
          data: comments,
          total,
          offset,
          limit
        }
      })
    }
}

export const commentsService = new CommentsService();
