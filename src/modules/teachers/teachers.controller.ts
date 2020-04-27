import { Request, Response, NextFunction } from 'express';
import { teachersService } from './teachers.service'
import { Teachers } from './teachers.model';

class TeachersController {

  async createOneTeacher(req: Request, res: Response, next: NextFunction) {
    try {
      const teachers = await teachersService.createOneTeacher(req.body);
      res.json(teachers);
    }
    catch (err) {
      next(err);
    }
  }

  async findAllTeachers(req: Request, res: Response, next: NextFunction) {
    try {
      const teachers = await teachersService.findAllTeachers();
      res.json(teachers);
    }
    catch (err) {
      next(err);
    }
  }

  async findTeacherById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = +req.params.id;
      const teacher = await teachersService.findOneById(id);
      res.json(teacher);
    }
    catch (err) {
      next(err);
    }
  }

  async deleteOneById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = +req.params.id;
      const deleted = await teachersService.deleteOneById(id);
      res.json(deleted);
    }
    catch (err) {
      next(err);
    }
  }
}

export const teachersController = new TeachersController();
