import { Teachers } from './teachers.model';

class TeachersService {
  public async findOneByEmail(email: string) {
    const teacher = await Teachers.findOne({
      where: { email },
    });

    return teacher;
  }
}

export const teachersService = new TeachersService();
