import { Request, Response, NextFunction } from 'express';
import { studentsService } from './students.service';
import {UpdateRequest} from '../../common/types/types';
import { Students } from './students.model';

class StudentsController {
  public async createOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const student = await studentsService.createOne(req.body);
      res.json(student);
    } catch (e) {
      next(e);
    }
  }

  public async updateOne(req: UpdateRequest<Students>,
                         res: Response, next: NextFunction): Promise<void> {
    try {
      const student: Students = await studentsService.updateOne(+req.params.id, req.body, req.user);
      res.json(student);
    } catch (e) {
      next(e);
    }
  }
}

export const studentsController = new StudentsController();
