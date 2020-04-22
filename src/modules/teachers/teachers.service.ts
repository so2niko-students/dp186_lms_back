import { Teachers } from './teachers.model';

class TeachersService {
  public async findOneByEmail(email: string) {
    const teacher = await Teachers.findOne({
      where: { email },
    });

    return teacher;
  }

  public async findOneByPassword(password: string) {
    const teacher = await Teachers.findOne({
      where: { password },
    });

    return teacher;
  }
}

export const teachersService = new TeachersService();
