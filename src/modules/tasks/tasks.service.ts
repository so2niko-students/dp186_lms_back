import { Tasks as Task } from './tasks.model';
import { CustomUser } from '../../common/types/types';
import { NotFound, BadRequest, Forbidden} from '../../common/exeptions/';
import { sequelize } from '../../database';

interface TasksInterface {
  groupId: number;
  taskName: string;
  fileURL: string;
}

class TasksService {
  public async findByGroup(user: CustomUser): Promise<Task[]> {
    if (!user.isMentor) {
      return await Task.findAll({ where: { groupId: user.groupId } });
    }
    return await Task.findAll();
  }

  public async findOneById(id: number): Promise<Task[]> {
    return await Task.findAll({ where: { id } });
  }

  public async createOne(
    task: TasksInterface,
    user: CustomUser
  ): Promise<Task> {
    if (!user.isMentor) {
      throw new Forbidden('You do not have permission for this');
    }
    return await Task.create(task);
  }

  public async updateOne(
    id: number,
    updates: object,
    user: CustomUser
  ): Promise<Task> {
    if (!user.isMentor) {
      throw new Forbidden('You do not have permission for this');
    }

    return await sequelize.transaction(async (transaction) => {
      const isExist = await Task.findOne({ where: { id }, transaction });
      if (!isExist) {
        throw new NotFound(`Can't find row with id ${id}`);
      }

      const [updatedRow, [updatedTask]] = await Task.update(updates, {
        returning: true,
        where: { id },
      });
      return updatedTask;
    });
  }

  public async deleteOne(id: number, user: CustomUser): Promise<number> {
    if (!user.isMentor) {
      throw new Forbidden('You do not have permission for this');
    }

    return await sequelize.transaction(async (transaction) => {
      const isExist = await Task.findOne({ where: { id }, transaction });
      if (!isExist) {
        throw new NotFound(`Can't find row with id ${id}`);
      }

      await Task.destroy({ where: { id }, transaction });
      return id;
    });
  }
}

export const tasksService = new TasksService();
