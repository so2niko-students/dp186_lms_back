import { Students } from './students.model';

class StudentsService {
  async findOneByEmail(email: string) {
    const teacher = await Students.findOne({
      where: { email }
    });

    return teacher;
  }
}

export default new StudentsService();