import { CustomUser } from '../../common/types/types';
import {NotFound, Forbidden, BadRequest} from '../../common/exeptions/';

import {Teachers} from '../teachers/teachers.model';
import {Students} from '../students/students.model';
import {Avatars} from '../avatars/avatars.model';
import { Tasks as Task, Tasks } from './tasks.model';
import {Solution} from '../solutions/solutions.model';
import {Comment} from '../comments/comments.model';
import {File} from '../files/files.model';

import { groupsService } from '../groups/groups.service';
import { solutionsService } from '../solutions/solutions.service';
import { paginationService } from '../pagination/pagination.service';

import { sequelize } from '../../database';
import {Transaction, QueryInterface} from 'sequelize';

export interface ITasks {
    groupId: number;
    taskName: string;
    fileURL: string;
    description: string;
}

const NO_RIGHTS = 'You do not have rights to do this.';

class TasksService {
    private async addTaskAdditionalInfo(task) {
      const amountOfChecked: number = await solutionsService.countChecked(task.id);
      
      // ---DO IT INSIDE SOLUTION-SERVICE----
      const solutions: Solution[] = await Solution.findAll({ where: { taskId: task.id }})
      const averageGrade: number = solutions.reduce((previous, current) => {
        return previous += current.grade
      }, 0) / solutions.length
      const solutionIds: number[] = solutions.map(item => item.id);
      // ---DO IT INSIDE SOLUTION-SERVICE----

      let amountOfReady: number = 0;
      for (const id of solutionIds) {

      // ---DO IT INSIDE COMMENT-SERVICE----
        const comment = await Comment.findOne({ where: { solutionId: id } })
        if (comment) {
          amountOfReady++;
        }
      // ---DO IT INSIDE COMMENT-SERVICE----
      }
      task.setDataValue('averageGrade', averageGrade)
      task.setDataValue('amountOfChecked', amountOfChecked)
      task.setDataValue('amountOfReady', amountOfReady)
    }


    public async findAll(user: CustomUser, query) {
      const page: number = parseInt(query.page) || 1;
      const limit: number = parseInt(query.limit) || 10;
      const groupId: number = parseInt(query.groupId);

      // Checking if Group exists 
      const group = await groupsService.findOneOrThrow(groupId, user)
      if (!group) {
        throw new BadRequest(`There is no group with id ${groupId}`);
      }

      // Checking if STUDENT have rights for this request
      if (!user.isMentor && user.groupId !== groupId) {
        throw new Forbidden(NO_RIGHTS);
      }

      return sequelize.transaction(async (transaction) => {
        // Checking if TEACHER have rights for this request
        const group = await groupsService.findOneOrThrow(groupId, user, transaction)
        if (user.isMentor && !user.isAdmin && user.id !== group.teacherId) {
          throw new Forbidden(NO_RIGHTS);
        }
        
        // Getting pagination information for DB-request
        const total: number = await Tasks.count({ where: { groupId }, transaction}); 
        const {offset, actualPage} = await paginationService.getOffset(page, limit, total);

        // Forming paginated array of tasks with 
        // additional information (amount of checked and ready for check tasks)
        const tasks: Tasks[] = await Task.findAll({ limit, offset, where: { groupId }, transaction }); 
        if (!tasks.length) {
          throw new NotFound(`There is no tasks for group with groupId ${groupId}`);
        } 
        for (const task of tasks) { 
          await this.addTaskAdditionalInfo(task) //---------------------DON'T FORGET TO PASTE TRANSACTION----------------------------------------------------
        }

        return {
          tasks, 
          pagination: {
            total,
            actualPage,
            limit
          }    
        };
      })
    }    

    public async getTaskInfoById(id: number, user: CustomUser) {
        let fullRequest;

        if (!user.isMentor) { // student 
          fullRequest = {  
            where: { id }, 
            include: [{
              model: File, as: 'files', attributes: ['fileLink'], 
            }, { 
              model: Solution, as: 'solutions', where: {studentId: user.id}, include: [{
                model: Comment, as: 'comments', attributes: ['text', 'updatedAt'], include: [{
                  model: Students, as: 'student', attributes: ['firstNameEng', 'lastNameEng'], include: [{
                    model: Avatars, as: 'avatar', attributes: ['avatarLink']
                  }]
                }, {
                  model: Teachers, as: 'teacher' , attributes: ['firstName', 'lastName'], include: [{
                    model: Avatars, as: 'avatar', attributes: ['avatarLink']
                  }]
                }]
              }]
            }],
          }
        } else { // teacher or superAdmin
          fullRequest = {  
            where: { id }, include: [{ 
              model: Solution, as: 'solutions', include: [{
                model: Students, as: 'student', attributes: ['firstNameEng', 'lastNameEng'], include: [{
                  model: Avatars, as: 'avatar', attributes: ['avatarLink']
                }]
              }]
            }],
          };
        }

        const task: Task = await Task.findOne(fullRequest);
        if (!task) {
            throw new NotFound(`Can't find task with id ${id}`);
        }
        await this.addTaskAdditionalInfo(task) //---------------------DON'T FORGET TO PASTE TRANSACTION----------------------------------------------------

        const group = await groupsService.findOneOrThrow(task.groupId, user)
        if (user.isMentor && !user.isAdmin && user.id !== group.teacherId) {
          throw new Forbidden(NO_RIGHTS);
        }
        
        if (!user.isMentor && user.groupId !== task.groupId) {
            throw new Forbidden(NO_RIGHTS);
        }

        return task;
    }

    public async findOneById(id: number, user: CustomUser, transaction?: Transaction) {
      const task: Task = await Task.findOne({ where: { id }, transaction });
      if (!task) {
        throw new NotFound(`Can't find task with id ${id}`);
      }

      if (!user.isMentor && user.groupId !== task.groupId) {
        throw new Forbidden(NO_RIGHTS);
      }

      return task;
    }

    public async createOne(task: ITasks, user: CustomUser):Promise<Task> {
        if (!user.isMentor) {
            throw new Forbidden(NO_RIGHTS);
        }

        return sequelize.transaction(async (transaction) => {
            const group = await groupsService.findOneOrThrow(task.groupId, user, transaction)
            if (user.isMentor && !user.isAdmin && user.id !== group.teacherId) {
                throw new Forbidden(NO_RIGHTS);
            }
            const createdTask:Task = await Task.create(task, {transaction});
            await solutionsService.createSolutions(createdTask, user, transaction);
            return createdTask;
        });
    }

    public async updateOne(
        id: number,
        updates: ITasks,
        user: CustomUser
    ): Promise<Task> {
        if (!user.isMentor) {
            throw new Forbidden(NO_RIGHTS);
        }

        return sequelize.transaction(async (transaction) => {
            const task: Task = await Task.findOne({ where: { id }, transaction });
            if (!task) {
                throw new NotFound(`Can't find task with id ${id}`);
            }

            const group = await groupsService.findOneOrThrow(task.groupId, user, transaction)
            if (user.isMentor && !user.isAdmin && user.id !== group.teacherId) {
                throw new Forbidden(NO_RIGHTS);
            }

            const [updatedRow, [updatedTask]] = await Task.update(updates, {
                returning: true,
                where: { id },
                transaction,
            });
            return updatedTask;
        });
    }

    public async deleteOne(id: number, user: CustomUser): Promise<number> {
        if (!user.isMentor) {
            throw new Forbidden(NO_RIGHTS);
        }

        return sequelize.transaction(async (transaction) => {
            const task: Task = await Task.findOne({ where: { id }, transaction });
            if (!task) {
                throw new NotFound(`Can't find task with id ${id}`);
            }

            const group = await groupsService.findOneOrThrow(task.groupId, user, transaction)
            if (user.isMentor && !user.isAdmin && user.id !== group.teacherId) {
                throw new Forbidden(NO_RIGHTS);
            }

            await Task.destroy({ where: { id }, transaction });
            return id;
        });
    }
}

export const tasksService = new TasksService();
