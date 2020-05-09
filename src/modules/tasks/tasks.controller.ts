import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../common/types/types';
import { tasksService } from './tasks.service';
import { validateIdOrThrow } from '../../common/validators';

import { Tasks as Task } from './tasks.model';

class TasksController {
  public async findAll(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // const tasks: Task[] = await tasksService.findAll(req.user);
      const tasks = await tasksService.findAll(req.user, req.query);
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
      const idNumb: number = validateIdOrThrow(req.params.id);
      const task: Task = await tasksService.getTaskInfoById(idNumb, req.user);

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
      const createdTask: Task = await tasksService.createOne(req.body, req.user);
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
      const idNumb: number = validateIdOrThrow(req.params.id);

      const updatedTask: Task = await tasksService.updateOne(idNumb, req.body, req.user);
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
      const idNumb: number = validateIdOrThrow(req.params.id);

      const removedTaskId: number = await tasksService.deleteOne(idNumb, req.user);
      res.json({ id: removedTaskId });
    } catch (e) {
      next(e);
    }
  }
}

export const tasksController = new TasksController();
