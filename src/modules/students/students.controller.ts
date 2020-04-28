import { Request, Response, NextFunction } from 'express';
import { studentsService } from './students.service';
import { AuthRequest } from '../../common/types/types';

class StudentsController {
  public async createOne(req: Request, res: Response, next: NextFunction) {
    try {
      const student = await studentsService.createOne(req.body);
      res.json(student);
    } catch (e) {
      next(e);
    }
  }

  public async deleteStudents( req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const student = await studentsService.deleteStudents(
          req.body,
          req.user
      );
      if(student){
        res.status(201)
      }
      res.json(student);
    } catch (e) {
      next(e);
    }
  }
}

export const studentsController = new StudentsController();
