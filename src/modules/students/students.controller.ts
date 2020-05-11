import { Request, Response, NextFunction } from 'express';
import { studentsService } from './students.service';
import { AuthRequest } from '../../common/types/types';
import { Students } from './students.model';
import { UpdateRequest } from '../../common/types/types';
import { validateIdOrThrow } from '../../common/validators/';

class StudentsController {
  public async createOne(req: Request, res: Response, next: NextFunction) {
    try {
      const student = await studentsService.createOne(req.body);
      res.json(student);
    } catch (e) {
      next(e);
    }
  }

  public async deleteStudents( req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      validateIdOrThrow(+req.params.id);
      await studentsService.deleteStudent(
          +req.params.id,
          req.user
      );
      res.send(201)
    } catch(e){
      next(e)
    }}

  public async updateOne(req: UpdateRequest<Students>,
                         res: Response, next: NextFunction): Promise<void> {
    try {
      validateIdOrThrow(+req.params.id);
      const student = await studentsService.updateOneOrThrow(+req.params.id, req.body, req.user);
      res.json(student);
    } catch (e) {
      next(e);
    }
  }
}

export const studentsController = new StudentsController();
