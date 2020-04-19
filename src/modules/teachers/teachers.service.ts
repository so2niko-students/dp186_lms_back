import { Teachers } from './teachers.model';

class TeachersService {
  async findOneByEmail(email: string) {
    const teacher = await Teachers.findOne({
      where: { email }
    });
    console.log(teacher);

    return teacher;
  }
}

export default new TeachersService();