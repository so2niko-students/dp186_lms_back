import { Teachers } from './teachers.model';
import { hashFunc } from '../auth/password.hash';
import { Unauthorized } from '../../common/exeptions/index';
import * as bcrypt from 'bcrypt';
import { IUpdatePassword } from '../../common/interfaces/auth.interfaces';

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

  public async updatePassword({ oldPassword, newPassword }: IUpdatePassword,
                              user: Teachers) {
    const userForUpdate: Teachers = await this.findOneById(user.id);

    if (!bcrypt.compareSync(oldPassword, user.password)) {
        throw new Unauthorized('Wrong password');
    }

    userForUpdate.password = hashFunc(newPassword);

    return userForUpdate.save();
  }

  public async updatePasswordBySuperAdmin(id: number,
                                          { newPassword }: IUpdatePassword, user: Teachers) {
    const userForUpdate: Teachers = await this.findOneById(id);

    if (!user.isAdmin) {
        throw new Unauthorized('You cannot change password for another teacher');
    }

    userForUpdate.password = hashFunc(newPassword);

    return userForUpdate.save();
  }
}

export const teachersService = new TeachersService();
