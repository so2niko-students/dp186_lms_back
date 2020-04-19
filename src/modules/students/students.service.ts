import { Students } from './students.model';

class StudentsService {
  async findOneByEmail(email: string) {
    const teacher = await Students.findOne({
      where: { email }
    });
    console.log(teacher);

    return teacher;
  }
}

export default new StudentsService();