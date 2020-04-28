import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../common/types/types';
import { teachersService } from './teachers.service'
// import { Teachers } from './teachers.model';

import { CustomUser } from '../../common/types/types';

class TeachersController {

  public async createOneTeacher(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = req.body;
      const user: CustomUser = req.user;

      const teachers = await teachersService.createOneTeacher(body, user);
      res.json(teachers);
    }
    catch (e) {
      next(e);
    }
  }

  public async deleteOneById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id: number = +req.params.id;
      const user: CustomUser = req.user;

      const removedTeacherId = await teachersService.deleteOneById(id, user);
      res.json(removedTeacherId);
    }
    catch (e) {
      next(e);
    }
  }

  public async findAllTeachers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const offset: number = +req.query.offset || 2;
      const limit: number = +req.query.limit || 2;
    
      const teachers = await teachersService.findAllTeachers(offset, limit);
      res.json(teachers);
    }
    catch (e) {
      next(e);
    }
  }

  public async findTeacherById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id: number = +req.params.id;

      const teacher = await teachersService.findOneById(id);
      res.json(teacher);
    }
    catch (e) {
      next(e);
    }
  }
}

export const teachersController = new TeachersController();
