import { Tasks } from './tasks.model';

interface ITaskCreate {
  groupId: number;
  taskName: string;
  fileURL: string;
}

class TasksService {
  async findAll(): Promise<object> {
    return await Tasks.findAll();
  }

  async createOne(task: ITaskCreate): Promise<object> {
    return await Tasks.create(task);
  }

  async deleteOne(id: number): Promise<void> {
    await Tasks.destroy({ where: { id } });
  }
}

export const tasksService = new TasksService();
