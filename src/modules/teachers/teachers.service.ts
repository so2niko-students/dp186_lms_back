import { Teachers } from './teachers.model';

class TeachersService {
  async findOneByEmail(email: string) {
    const teacher = await Teachers.findOne({
      where: { email }
    });
    
    return teacher;
  }
}

export default new TeachersService();