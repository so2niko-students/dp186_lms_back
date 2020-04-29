import { Tasks as Task } from './tasks.model';
import { Groups as Group} from '../groups/groups.model';
import { CustomUser } from '../../common/types/types';
import { NotFound, Forbidden} from '../../common/exeptions/';
import { sequelize } from '../../database';

interface ITasks {
  groupId: number;
  taskName: string;
  fileURL: string;
}

const NO_RIGHTS = 'You do not have rights to do this.';

class TasksService {
  public async findByGroup(user: CustomUser): Promise<Task[]> {
    if (!user.isMentor) {
      const tasks: Task[] = await Task.findAll({ where: { groupId: user.groupId } });
      if (!tasks.length) {
        throw new NotFound(`There is no tasks for group with groupId ${user.groupId}`)
      }
      return tasks;
    }
    return await Task.findAll();
  }

  public async findOneById(id: number, user: CustomUser) {
    const task: Task = await Task.findOne({ where: { id }});
    if (!task) {
      throw new NotFound(`Can't find task with id ${id}`);
    }

    if (!user.isMentor) {
      if (task.groupId === user.groupId) {
        return task
      } else {
        throw new Forbidden(NO_RIGHTS);
      }
    } 
    return task;
  }

  public async createOne(
    task: ITasks,
    user: CustomUser
  ): Promise<Task> {
    if (!user.isMentor) {
      throw new Forbidden(NO_RIGHTS);
    }

    if (user.isMentor && !user.isAdmin) {
      return sequelize.transaction(async (transaction) => {
        const group: Group = await Group.findOne({where: {id: task.groupId}, transaction})
        if (group.teacherId !== user.id) {
          throw new Forbidden(NO_RIGHTS);
        } else {
          return await Task.create(task, { transaction });
        }
      });
    } 

    if (user.isAdmin) {
      return await Task.create(task);
    }
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

      const [updatedRow, [updatedTask]] = await Task.update(updates, {
        returning: true,
        where: { id },
        transaction
      });
      return updatedTask;
    });
  }

  public async deleteOne(id: number, user: CustomUser): Promise<object> {
    if (!user.isMentor) {
      throw new Forbidden(NO_RIGHTS);
    }

    return sequelize.transaction(async (transaction) => {
      const task: Task = await Task.findOne({ where: { id }, transaction });
      if (!task) {
        throw new NotFound(`Can't find task with id ${id}`);
      }

      await Task.destroy({ where: { id }, transaction });
      return { id };
    });
  }
}

export const tasksService = new TasksService();
