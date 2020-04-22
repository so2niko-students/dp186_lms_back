import { Teachers } from './teachers.model';

class TeachersService {
  async findOneByEmail(email: string) {
    const teacher = await Teachers.findOne({
      where: { email },
    });

    return teacher;
  }

  async findOneById(id) {
    const teacher = await Teachers.findOne({ where: { id } });

    return teacher;
  }
}

export const teachersService = new TeachersService();
