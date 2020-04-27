import { teachersService } from './teachers.service'
import { Teachers } from './teachers.model';

class TeachersController {

  async findAllTeachers(req, res, next) {
    try {
      const teachers = await teachersService.findAllTeachers();
      res.json(teachers);
    }
    catch (err) {
      next(err);
    }
  }

  async findTeacherById(req, res, next) {
    try {
      const id = +req.params.id;
      const teacher = await teachersService.findOneById(id);
      res.json(teacher);
    }
    catch (err) {
      next(err);
    }
  }

  async createOneTeacher(req, res, next) {
    try {
      const teachers = await teachersService.createOneTeacher(req.body);
      res.json(teachers);
    }
    catch (err) {
      next(err);
    }
  }

  async deleteOneById(req, res, next) {
    try {
      const id = +req.params.id;
      const deleted = await teachersService.createOneTeacher(id);
      res.json(deleted);
    }
    catch (err) {
      next(err);
    }
  }
}

export const teachersController = new TeachersController();
