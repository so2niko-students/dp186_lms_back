import { Tasks as Task } from './tasks.model';
import { groupsService } from '../groups/groups.service';
import { CustomUser } from '../../common/types/types';
import {NotFound, Forbidden} from '../../common/exeptions/';
import { sequelize } from '../../database';
import {Solution} from '../solutions/solutions.model';
import {solutionsService} from '../solutions/solutions.service';
import {Transaction} from 'sequelize';

interface ITasks {
    groupId: number;
    taskName: string;
    fileURL: string;
}

const NO_RIGHTS = 'You do not have rights to do this.';

class TasksService {
    public async findAll(user: CustomUser): Promise<Task[]> {
        if (!user.isMentor) {
            const tasks: Task[] = await Task.findAll({ where: {groupId: user.groupId} });
            if (!tasks.length) {
                throw new NotFound(`There is no tasks for group with groupId ${user.groupId}`);
            }
            return tasks;
        }

        return await Task.findAll();
    }

    public async findOneById(id: number, user: CustomUser, transaction?: Transaction) {
        const task: Task = await Task.findOne({ where: { id } });
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
            const taskCreate:Task = await Task.create(task, {transaction});
            const solutionsCreate:Solution[] = await solutionsService.createSolutions(taskCreate, user, transaction);
            return taskCreate;
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
