import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { auth } from './auth.config';
import { Unauthorized } from '../../common/exeptions/index';
import { studentsService } from '../../modules/students/students.service';
import { teachersService } from '../../modules/teachers/teachers.service';

class AuthService {
  public async login({ email, password }) {
    const user =
      (await studentsService.findOneByEmail(email)) ||
      (await teachersService.findOneByEmail(email));

    if (!bcrypt.compareSync(password, user.password)) {
      throw new Unauthorized('Wrong password');
    }
    const token = jwt.sign({ id: user.id, email: user.email }, auth.secretKey);
    return {
      token,
      expires: auth.expiresIn,
    };
  }
}

export const authService = new AuthService();
