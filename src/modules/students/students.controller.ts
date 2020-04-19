import studentsService from "./students.service";

class StudentsController {
  async createOne(req, res, next) {
    try {
      const student = await studentsService.createOne(req.body);
      res.json(student);
    } catch (e) {
      next(e);
    }
  }

  async findMany(req, res, next) {
    try {
      const data = await studentsService.findMany();

      res.json(data);
    } catch (e) {
      next(e);
    }
  }
}

const studentsController = new StudentsController();
export default studentsController;
