import { Teachers } from './teachers.model';
import { hashFunc } from '../auth/password.hash';
import { Unauthorized } from '../../common/exeptions/index';
import * as bcrypt from 'bcrypt';

interface IUpdatePassport {
  oldPassword?: string;
  newPassword: string;
}

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

  public async updatePasswordTeacher(data: IUpdatePassport, user: Teachers) {
    const { oldPassword, newPassword } = data;
    const userForUpdate: Teachers = await this.findOneById(user.id);

    if (!bcrypt.compareSync(oldPassword, user.password)) {
        throw new Unauthorized('Wrong password');
    }

    userForUpdate.password = hashFunc(newPassword);

    return userForUpdate.save();
  }

  public async updatePasswordSuperAdmin(id: number, data: IUpdatePassport, user: Teachers) {
    const { newPassword } = data;
    const userForUpdate: Teachers = await this.findOneById(id);

    if (!user.isAdmin) {
        throw new Unauthorized('You cannot change password for another teacher');
    }

    userForUpdate.password = hashFunc(newPassword);

    return userForUpdate.save();
  }
}

export const teachersService = new TeachersService();
