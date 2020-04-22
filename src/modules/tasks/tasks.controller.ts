import { Request, Response, NextFunction } from 'express';
import { tasksService } from './tasks.service';

class TasksController {
  public async findAll(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const tasks: object[] = await tasksService.findAll();
      res.json(tasks);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  public async findOneById(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const idNumb: number = parseInt(req.params.id);
      const task: object[] = await tasksService.findOneById(idNumb);
      res.json(task);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  public async createOne(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const createdTask: object = await tasksService.createOne(req.body);
      res.json(createdTask);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  public async updateOne(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const idNumb: number = parseInt(req.params.id);
      const updates: object = req.body;

      const updatedTask: object = await tasksService.updateOne(idNumb, updates);
      res.json(updatedTask);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  public async deleteOne(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const idNumb: number = parseInt(req.params.id);
      await tasksService.deleteOne(idNumb);
      res.end();
    } catch (e) {
      console.log(typeof e)
      console.log(e);
      next(e);
    }
  }
}

export const tasksController = new TasksController();
