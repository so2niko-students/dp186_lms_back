import { Students } from './students.model';

class StudentsService {
  public async findOneByEmail(email: string): Promise<Students> {
    const teacher = await Students.findOne({
      where: { email },
    });

    return teacher;
  }
}

export default new StudentsService();
