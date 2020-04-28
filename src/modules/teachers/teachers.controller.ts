import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../common/types/types';
import { teachersService } from './teachers.service'
// import { Teachers } from './teachers.model';

import { CustomUser } from '../../common/types/types';

class TeachersController {

  async createOneTeacher(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
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

  async deleteOneById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = +req.params.id;
      const user: CustomUser = req.user;

      const removedTeacherId = await teachersService.deleteOneById(id, user);
      res.json(removedTeacherId);
    }
    catch (e) {
      next(e);
    }
  }

  async findAllTeachers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const teachers = await teachersService.findAllTeachers();
      res.json(teachers);
    }
    catch (e) {
      next(e);
    }
  }

  async findTeacherById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = +req.params.id;
      const teacher = await teachersService.findOneById(id);
      res.json(teacher);
    }
    catch (e) {
      next(e);
    }
  }
}

export const teachersController = new TeachersController();
