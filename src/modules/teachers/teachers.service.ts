import { Teachers } from './teachers.model';
import { Unauthorized, NotFound } from '../../common/exeptions';
import { sequelize } from '../../database';
import { Transaction } from 'sequelize/types';

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

  public async findOneById(id: number, transaction: Transaction) {
    const teacher = await Teachers.findOne({
      where: { id },
    });

    return teacher;
  }


  public async updateOne(id: number, data: Partial<ITeachersData>, user: Teachers) {
    if (id !== user.id && !user.isAdmin) {
      throw new Unauthorized('You cannot change another profile');
    }

    return sequelize.transaction(async (transaction) => {
      const teacher: Teachers = await this.findOneById(id, transaction);

      if (user.isAdmin && !teacher) {
        throw new NotFound(`There is no teacher with id ${id}`);
      }

      await Teachers.update(data, { where: { id }, transaction });
      return this.findOneById(id, transaction);
    });
  }
}

export const teachersService = new TeachersService();
