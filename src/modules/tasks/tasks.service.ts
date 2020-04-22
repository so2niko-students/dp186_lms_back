import { Tasks } from './tasks.model';

interface TasksInterface {
  groupId: number;
  taskName: string;
  fileURL: string;
}

class TasksService {
  public async findAll(): Promise<TasksInterface[]> {
    return await Tasks.findAll();
  }

  public async findOneById(id: number): Promise<TasksInterface[]> {
    return await Tasks.findAll({ where: { id } });
  }

  public async createOne(task: TasksInterface): Promise<TasksInterface> {
    return await Tasks.create(task);
  }

  public async updateOne(id: number, updates: object): Promise<TasksInterface> {
    const [updatedRow, [updatedTask]] = await Tasks.update(updates, {
      returning: true,
      where: { id },
    });
    return updatedTask;
  }

  public async deleteOne(id: number): Promise<void> {
    await Tasks.destroy({ where: { id } });
  }
}

export const tasksService = new TasksService();
