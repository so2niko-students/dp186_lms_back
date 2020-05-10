import { Solution } from '../solutions/solutions.model';
import { NotFound, BadRequest, Forbidden } from '../../common/exeptions/';
import { CustomUser } from '../../common/types/types';
import {tasksService} from '../tasks/tasks.service';
import {groupsService} from '../groups/groups.service';
import {commentsService} from '../comments/comments.service';
import {studentsService} from '../students/students.service';
import {Transaction} from 'sequelize';
import {Tasks} from '../tasks/tasks.model';
import { Teachers as Teacher } from '../teachers/teachers.model';
import { Students as Student } from '../students/students.model';
import { Avatars as Avatar } from '../avatars/avatars.model';
import { Comment } from '../comments/comments.model';
import { File } from '../files/files.model';
import {sequelize} from '../../database';

export interface ISolutionCreate {
    studentId: number;
    taskId: number;
    grade?: number;
    isCompleted?: number;
}

class SolutionsService {

    public async createSolutions(task: Tasks, user: CustomUser, transaction:Transaction): Promise<Solution[]> {
        const {groupId} = task;
        const solutionsList =[];
        const taskId = task.id;

        const studentsInGroup = await studentsService.findAllByGroupId(groupId, transaction);

        studentsInGroup.map((el) => {
            solutionsList.push ({
                studentId: el.id,
                taskId: taskId,
                isCompleted: 0,
                grade: 0
            })
        });

        return Solution.bulkCreate(solutionsList, {transaction});
    }

    public async updateOneOrThrow(id: number, data: Partial<ISolutionCreate>, user: CustomUser):Promise<Solution> {
        const { isCompleted, grade } = data;

        return sequelize.transaction(async (transaction: Transaction) => {

            // нахожу по id решение, проверяю можно ли его обновлять
            const solution = await this.checkIsCompletedOrThrow(id);

            //нахожу по id - таску
            const task = await tasksService.findOneById(solution.taskId, user, transaction);

            // нахожу по id группу
            const group = await groupsService.findOneOrThrow(task.groupId, user, transaction);

            // проверяю, совпадает ли поль-ль с ментором группы
            if (group.teacherId !== user.id) {
                throw new Forbidden('The only teacher can update solution');
            }

            // мержим объект
            Object.keys(data).forEach((k) => solution[k] = data[k]);
            if (grade) {
                solution.grade = grade;
            }
            if (isCompleted) {
                solution.isCompleted = isCompleted;
            }
            return solution.save({transaction});
        })
    }

    private async checkIsCompletedOrThrow(id): Promise<Solution> {

        const solution = await this.findOneOrThrow(id);

        // проверяю, если решение подтвержено его нельзя изменять
        if (solution.isCompleted) {
            throw new BadRequest(`Solution with id = ${id} has been completed. You can not update it.`);
        }
        return solution;
    }

    public async findOneOrThrow (id:number, transaction?: Transaction): Promise<Solution> {
        const solution = Solution.findOne({ where: { id }, transaction })
        if(!solution) {
            throw new NotFound('Solution number = ${id} does not exist in DB.');
        }
        return solution;
    }

    public async countChecked(taskId: number, transaction: Transaction): Promise<number> {
      return await Solution.count({ where: { taskId, isCompleted: 1 }, transaction });
    }

    public async findByTaskId(taskId: number, transaction?: Transaction): Promise<Solution[]> {
      return await Solution.findAll({ where: { taskId }, transaction})
    }

    public async deleteOne(taskId: number, transaction?: Transaction): Promise<void> {
      await Solution.destroy({ where: { taskId }, transaction })
    }

    public async getFullInfoById(id: number, query) {
      const offset: number = parseInt(query.offset) || 0;
      const limit: number = parseInt(query.limit) || 20;

      return sequelize.transaction(async (transaction) => {
        const total: number = await commentsService.countComments(id, transaction);

        const solutionWithComments = await Solution.findOne({ 
          where: { id },
          include: [{
            model: Student, as: 'student', include: [{
              model: Avatar, as: 'avatar', attributes: ['avatarLink']
            }]
          }, {
            model: Comment, as: 'comments', attributes: ['text', 'updatedAt', 'createdAt'], limit, include: [{ //offset isn't working here (???)
              model: Student, as: 'student', attributes: ['firstNameEng', 'lastNameEng'], include: [{
                model: Avatar, as: 'avatar', attributes: ['avatarLink']
              }]
            }, {
              model: Teacher, as: 'teacher' , attributes: ['firstName', 'lastName'], include: [{
                model: Avatar, as: 'avatar', attributes: ['avatarLink']
              }]
            }, {
              model: File, as: 'files', attributes: ['fileLink']
            }]
          }],
          transaction
        });

        return {
          data: solutionWithComments,
          total,
          offset,
          limit
        }
      });
    }
}

export const solutionsService = new SolutionsService();
