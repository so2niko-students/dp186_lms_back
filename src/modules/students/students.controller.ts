import { Request, Response, NextFunction } from 'express';
import { studentsService } from './students.service';
import { Students } from './students.model';
import { UpdateRequest } from '../../common/types/types';

class StudentsController {
  public async createOne(req: Request, res: Response, next: NextFunction) {
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
