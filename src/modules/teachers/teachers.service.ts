import { Teachers } from './teachers.model';
import { hashFunc } from '../auth/password.hash';
import { Unauthorized } from '../../common/exeptions/index';
import * as bcrypt from 'bcrypt';
import { IUpdatePassword } from '../../common/interfaces/auth.interfaces';
import TokenFactory, {IToken} from "../../common/crypto/TokenFactory";

class TeachersService {
  async findOneByEmail(email: string) {
    return Teachers.findOne({
      where: {email},
    });}

  async findOneById(id) {
    return Teachers.findOne({where: {id}});
  }

  public async setForgotPasswordToken(email): Promise<string> {
    //Generate and hash password token
    const teacher = await this.findOneByEmail(email);
    const token: IToken = TokenFactory.generateResetToken();
    teacher.resetPasswordExpire = Date.now() + (60 * 1000 * 360);
    teacher.resetPasswordToken = token.hashed;
    await teacher.save();
    return token.regular;
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
