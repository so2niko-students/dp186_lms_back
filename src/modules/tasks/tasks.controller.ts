import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../common/types/types';
import { tasksService } from './tasks.service';
import { validateIdOrThrow } from '../../common/validators';

import { Tasks as Task } from './tasks.model';

class TasksController {
  public async findByGroup(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const tasks: Task[] = await tasksService.findByGroup(req.user);
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
      validateIdOrThrow(idNumb);
      const task: Task = await tasksService.findOneById(idNumb, req.user);

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
      const idNumb: number = parseInt(req.params.id);
      validateIdOrThrow(idNumb);

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
      const idNumb: number = parseInt(req.params.id);
      validateIdOrThrow(idNumb);

      const removedTaskId: object= await tasksService.deleteOne(idNumb, req.user);
      res.json(removedTaskId);
    } catch (e) {
      next(e);
    }
  }
}

export const tasksController = new TasksController();
