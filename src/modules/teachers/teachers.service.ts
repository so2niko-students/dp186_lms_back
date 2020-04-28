import { Teachers } from './teachers.model';
import { Unauthorized } from '../../common/exeptions';
import { sequelize } from '../../database';

interface ITeachersData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

class TeachersService {
  public async findOneByEmail(email: string) {
    const teacher = await Teachers.findOne({
      where: { email },
    });

    return teacher;
  }

  public async findOneById(id: number) {
    const teacher = await Teachers.findOne({ where: { id } });

    return teacher;
  }

  public async updateOne(id: number, data: Partial<ITeachersData>, user: Teachers) {
    if (id !== user.id && !user.isAdmin) {
      throw new Unauthorized('You cannot change another profile');
    }

    await Teachers.update(data, {where: {id}});

    return id;
  }

}

export const teachersService = new TeachersService();
