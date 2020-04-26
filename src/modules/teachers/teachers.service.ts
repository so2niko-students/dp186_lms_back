import { Teachers } from './teachers.model';
import { NotFound } from '../../common/exeptions/';
import {Avatars} from '../avatars/avatars.model';
import {Transaction} from 'sequelize';

class TeachersService {
  public async findOneByEmail(email: string) {
    const teacher = await Teachers.findOne({
      where: { email },
      include: [{
        model: Avatars, as: 'avatar', attributes: ['avatarLink'],
      }],
    });

    return teacher;
  }

  public async findOneById(id) {
    const teacher = await Teachers.findOne({
      where: { id },
      include: [{
        model: Avatars, as: 'avatar', attributes: ['avatarLink'],
      }],
    });

    return teacher;
  }
  public async findOneByIdOrThrow(id: number, transaction?: Transaction): Promise<Teachers> {
    const teacher = await Teachers.findOne({
      where: {id},
      include: [{
        model: Avatars, as: 'avatar', attributes: ['avatarLink'],
      }],
      attributes: {exclude: ['password']},
      transaction,
    });
    if (!teacher) {
      throw new NotFound(`Teacher with ${id} not found`);
    }
    return teacher;
  }
}

export const teachersService = new TeachersService();
