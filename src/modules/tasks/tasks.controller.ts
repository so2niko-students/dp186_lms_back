import { Request, Response, NextFunction } from 'express';
import { tasksService } from './tasks.service'

class TasksController {
  async findAll(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const tasks: object = await tasksService.findAll();
      res.json(tasks);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async createOne(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const createdTask: object = await tasksService.createOne(req.body);
      res.json(createdTask);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async deleteOne(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      console.log(req.params.id)
      const idNumb: number = parseInt(req.params.id);
      await tasksService.deleteOne(idNumb)
      res.end();
    } catch (e) {
      console.log(e)
      next(e)
    }
  }
}

export const tasksController = new TasksController();