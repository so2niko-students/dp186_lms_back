import { Teachers } from './teachers.model';

class TeachersService {
  public async findOneByEmail(email: string) {
    const teacher = await Teachers.findOne({
      where: { email },
    });

    return teacher;
  }

  public async findOneById(id: number) {
    const teacher = await Teachers.findOne({
      where: { id },
    });

    return teacher;
  }
}

export const teachersService = new TeachersService();
