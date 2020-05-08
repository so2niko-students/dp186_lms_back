import { Tasks as Task } from './tasks.model';
import { groupsService } from '../groups/groups.service';
import { CustomUser } from '../../common/types/types';
import {NotFound, Forbidden} from '../../common/exeptions/';
import { sequelize } from '../../database';
import {Solution} from '../solutions/solutions.model';
import {Students} from '../students/students.model';
import {Teachers} from '../teachers/teachers.model';
import {Avatars} from '../avatars/avatars.model';
import {File} from '../files/files.model';
import {Comment} from '../comments/comments.model';
import {solutionsService} from '../solutions/solutions.service';
import {Transaction} from 'sequelize';
// import { request } from 'http';

export interface ITasks {
    groupId: number;
    taskName: string;
    fileURL: string;
    description: string;
}

const NO_RIGHTS = 'You do not have rights to do this.';

class TasksService {
    public async additionalInfo(tasks, transaction?) {
      await tasks.forEach(async task => {
        const isReady = await Solution.count({
          where: {
            taskId: task.id,
            isCompleted: 1,
            // grade: !null
          }, transaction
        })
        task.isReady = isReady;
        // task.setDataValue('isReady', isReady)
        // Object.assign(task, {isReady})
        // console.log(task)
      })
    }
    // public async findAll(user: CustomUser): Promise<Task[]> {
    public async findAll(user: CustomUser) {
        // if (!user.isMentor) {
        //     const tasks = await Task.findAll({ where: {groupId: user.groupId} });
        //     this.additionalInfo(tasks)
        //     return tasks;
        // }
        // return sequelize.transaction(async (transaction) => {
          const tasks = await Task.findAll();
          this.additionalInfo(tasks)
          return tasks;
        // });
        // return Task.findAll({ 
        //   include: [{ 
        //     model: Solution, as: 'solution', include: [{
        //       model: 
        //     }] 
        //   }] 
        // });
        // return Task.findAll();
    }

    public async findOneById(id: number, user: CustomUser, transaction?: Transaction) {
        // const task: Task = await Task.findOne({ where: { id }, transaction });
        let fullRequest;

        if (!user.isMentor) {
          fullRequest = {  // ITS FOR STUDENT
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
            transaction 
          }
        } 

        if (user.isMentor && !user.isAdmin){
          fullRequest = {  // ITS FOR TEACHER
            where: { id }, include: [{ 
              model: Solution, as: 'solutions', include: [{
                model: Students, as: 'student', attributes: ['firstNameEng', 'lastNameEng'], include: [{
                  model: Avatars, as: 'avatar', attributes: ['avatarLink']
                }]
              }]
            }],
            transaction 
          };
        }

        const task: Task = await Task.findOne(fullRequest);

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
            const solutionsCreate:Solution[] = await solutionsService.createSolutions(createdTask, user, transaction);
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
