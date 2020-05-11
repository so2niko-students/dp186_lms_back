import { Teachers as Teacher } from '../teachers/teachers.model';
import { Groups as Group } from '../groups/groups.model';
import { Students as Student } from '../students/students.model';
import { Avatars as Avatar } from '../avatars/avatars.model';
import { Tasks as Task } from './tasks.model';
import { Solution } from '../solutions/solutions.model';
import { Comment } from '../comments/comments.model';
import { File } from '../files/files.model';

import { CustomUser } from '../../common/types/types';
import { IPaginationOuterData } from '../../common/interfaces/pagination.interfaces';
import { IFileCreate } from '../files/files.service';

import { NotFound, Forbidden, BadRequest } from '../../common/exeptions/';
import { sequelize } from '../../database';
import { Transaction } from 'sequelize';

import { groupsService } from '../groups/groups.service';
import { paginationService } from "../pagination/pagination.service";
import { solutionsService } from '../solutions/solutions.service';
import { commentsService } from '../comments/comments.service';
import { filesService } from '../files/files.service';

interface ITasks {
  groupId: number;
  taskName: string;
  description: string | null;
  fileNameExtension: string;
  fileContent: string;
}

const NO_RIGHTS = 'You do not have rights to do this.';

class TasksService {
    public async findAll(user: CustomUser, query): Promise<IPaginationOuterData<Task>>  {
      const page: number = parseInt(query.page) || 1;
      const limit: number = parseInt(query.limit) || 10;
      const groupId: number = parseInt(query.groupId);

      // Checking if STUDENT have rights for this request
      if (!user.isMentor && user.groupId !== groupId) {
        throw new Forbidden(NO_RIGHTS);
      }

      return sequelize.transaction(async (transaction) => {
        const group = await groupsService.findOneOrThrow(groupId, user, transaction);
        if (!group) {
          throw new BadRequest(`There is no group with id ${groupId}`);
        }

        // Checking if TEACHER have rights for this request
        if (user.isMentor && !user.isAdmin && user.id !== group.teacherId) {
          throw new Forbidden(NO_RIGHTS);
        }
        
        // Getting pagination information for DB-request
        const total: number = await Task.count({ where: { groupId }, transaction}); 
        const {offset, actualPage} = await paginationService.getOffset(page, limit, total);

        // Forming paginated array of tasks with 
        // additional information (amount of checked and ready for check tasks)
        const tasks: Task[] = await Task.findAll({ limit, offset, where: { groupId }, order: [['id', 'ASC']], transaction }); 
        if (!tasks.length) {
          throw new NotFound(`There is no tasks for group with groupId ${groupId}`);
        } 
        for (const task of tasks) { 
          await this.addTaskAdditionalInfo(task, transaction);
        }

        return {
          data: tasks, 
          page: actualPage,
          total,
          limit
        };
      })
    }

    public async getFullInfoById(id: number, user: CustomUser, transaction?: Transaction): Promise<Task> {
        let fullRequest;

        if (!user.isMentor) { // student 
          fullRequest = {  
            where: { id }, 
            include: [{
              model: File, as: 'files', attributes: ['fileLink'], 
            }, { 
              model: Solution, as: 'solutions', where: {studentId: user.id}, include: [{
                model: Comment, as: 'comments', attributes: ['text', 'updatedAt'], include: [{
                  model: Student, as: 'student', attributes: ['firstNameEng', 'lastNameEng'], include: [{
                    model: Avatar, as: 'avatar', attributes: ['avatarLink']
                  }]
                }, {
                  model: Teacher, as: 'teacher' , attributes: ['firstName', 'lastName'], include: [{
                    model: Avatar, as: 'avatar', attributes: ['avatarLink']
                  }]
                }]
              }]
            }],
            transaction
          }
        } else { // teacher or superAdmin
          fullRequest = {  
            where: { id }, include: [{ 
              model: Solution, as: 'solutions', include: [{
                model: Student, as: 'student', attributes: ['firstNameEng', 'lastNameEng'], include: [{
                  model: Avatar, as: 'avatar', attributes: ['avatarLink']
                }]
              }]
            }],
            transaction
          };
        }

        return sequelize.transaction(async (transaction) => {
          const task: Task = await Task.findOne(fullRequest);
          if (!task) {
              throw new NotFound(`Can't find task with id ${id}`);
          }
          await this.addTaskAdditionalInfo(task, transaction);

          const group: Group = await groupsService.findOneOrThrow(task.groupId, user, transaction);
          if (user.isMentor && !user.isAdmin && user.id !== group.teacherId) {
            throw new Forbidden(NO_RIGHTS);
          }
          
          if (!user.isMentor && user.groupId !== task.groupId) {
              throw new Forbidden(NO_RIGHTS);
          }

          return task;
        });
    }

    public async findOneById(id: number, user: CustomUser, transaction?: Transaction): Promise<Task> {
      const task: Task = await Task.findOne({ where: { id }, transaction });
      if (!task) {
          throw new NotFound(`Can't find task with id ${id}`);
      }

      if (!user.isMentor && user.groupId !== task.groupId) {
          throw new Forbidden(NO_RIGHTS);
      }

      return task;
    }

    private async addTaskAdditionalInfo(task: Task, transaction?: Transaction): Promise<void> {
      const amountOfChecked: number = await solutionsService.countChecked(task.id, transaction);
      const solutions: Solution[] = await solutionsService.findByTaskId(task.id, transaction);
      const solutionIds: number[] = solutions.map(item => item.id);

      let amountOfReady: number = 0;
      for (const id of solutionIds) {
        const comment: Comment = await commentsService.findOneBySolutionId(id, transaction);
        if (comment) {
          amountOfReady++;
        }
      }

      const averageGrade: number = this.calcAverageGrade(solutions);

      task.setDataValue('averageGrade', averageGrade)
      task.setDataValue('amountOfChecked', amountOfChecked)
      task.setDataValue('amountOfReady', amountOfReady)
    }

    private calcAverageGrade(solutions: Solution[]): number {
      return solutions.reduce((previous, current) => {
        return previous += current.grade
      }, 0) / solutions.length;
    }

    public async createOne(task: ITasks, user: CustomUser): Promise<Task> {
      if (!user.isMentor) {
        throw new Forbidden(NO_RIGHTS);
      }

      return sequelize.transaction(async (transaction) => {
        // Checks if tacher has this group
        const group: Group = await groupsService.findOneOrThrow(task.groupId, user, transaction)
        if (user.isMentor && !user.isAdmin && user.id !== group.teacherId) {
            throw new Forbidden(NO_RIGHTS);
        }

        const createdTask: Task = await Task.create(task, {transaction});
        await this.createFile(task.fileContent, task.fileNameExtension, createdTask.id, transaction)

        // Creates solutions per every student for this task
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

        // Checks if tacher has this group
        const group: Group = await groupsService.findOneOrThrow(task.groupId, user, transaction)
        if (user.isMentor && !user.isAdmin && user.id !== group.teacherId) { 
            throw new Forbidden(NO_RIGHTS);
        }

        // Updates Task table
        let updatedTask: Task;
        if (updates.description, updates.groupId, updates.taskName) {
          const [updatedRow, [updTask]] = await Task.update(updates, {
              returning: true,
              where: { id },
              transaction,
          });
          updatedTask = updTask;
        }

        // Removes old and creates new file in DataBase and Cloudinary
        if (updates.fileContent && updates.fileNameExtension) {
          await filesService.deleteOne(id, transaction);
          await this.createFile(updates.fileContent, updates.fileNameExtension, id, transaction)
        }

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

        // Checks if tacher has this group
        const group: Group = await groupsService.findOneOrThrow(task.groupId, user, transaction)
        if (user.isMentor && !user.isAdmin && user.id !== group.teacherId) {
            throw new Forbidden(NO_RIGHTS);
        }

        await filesService.deleteOne(id, transaction); // Removes file from DataBase and Cloudinary
        await solutionsService.deleteOne(id, transaction); // Removes solutions for this task
        await Task.destroy({ where: { id }, transaction }); // Removes task

        return id;
      });
    }

    private async createFile(fileLink: string, fileNameExtension: string, taskId: number, transaction?: Transaction): Promise<void> {
        // Creates new file in DataBase and Cloudinary
        const fileData: IFileCreate = {
          fileLink, 
          fileNameExtension, 
          taskId
        };
        await filesService.createOne(fileData, transaction);
    }
}

export const tasksService = new TasksService();
