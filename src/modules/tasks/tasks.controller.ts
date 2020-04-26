import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../common/types/types';
import { tasksService } from './tasks.service';

import { Tasks as Task } from './tasks.model';
import { CustomUser } from '../../common/types/types';

class TasksController {
  public async findByGroup(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = req.user;
      const tasks: Task[] = await tasksService.findByGroup(user);
      res.json(tasks);
    } catch (e) {
      next(e);
    }
  }

  public async findOneById(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const idNumb: number = parseInt(req.params.id);
      const task: Task[] = await tasksService.findOneById(idNumb);

      res.json(task);
    } catch (e) {
      next(e);
    }
  }

  public async createOne(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const taskData = req.body;
      const user: CustomUser = req.user;

      const createdTask: Task = await tasksService.createOne(taskData, user);
      res.json(createdTask);
    } catch (e) {
      next(e);
    }
  }

  public async updateOne(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const idNumb: number = parseInt(req.params.id);
      const updates: object = req.body;
      const user: CustomUser = req.user;

      const updatedTask: Task = await tasksService.updateOne(
        idNumb,
        updates,
        user
      );
      res.json(updatedTask);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  public async deleteOne(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const idNumb: number = parseInt(req.params.id);
      const user: CustomUser = req.user;

      const removedTaskId: number = await tasksService.deleteOne(idNumb, user);
      res.json(removedTaskId);
    } catch (e) {
      next(e);
    }
  }
}

export const tasksController = new TasksController();
