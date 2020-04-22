import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { auth } from './auth.config';
import { Unauthorized } from '../../common/exeptions/index';
import { studentsService } from '../../modules/students/students.service';
import { teachersService } from '../../modules/teachers/teachers.service';
import { hashFunc } from './password.hash';
import { Students } from '../students/students.model';
import { Teachers } from '../teachers/teachers.model';
import { CustomUser } from '../../common/types/types';

interface ILogin {
    email: string;
    password: string;
}

interface IUpdatePassport {
    oldPassword: string;
    newPassword: string;
}

class AuthService {
    public async login(data: ILogin) {
        const { email, password } = data;
        const user: Students | Teachers = await studentsService.findOneByEmail(email) ||
            await teachersService.findOneByEmail(email);

        if (!bcrypt.compareSync(password, user.password)) {
            throw new Unauthorized('Wrong password');
        }

        const token: string = jwt.sign({ id: user.id, email: user.email }, auth.secretKey);

        return {
            token,
            expires: auth.expiresIn,
        };
    }

    public async updatePassword(data: IUpdatePassport, user: CustomUser) {
        const { oldPassword, newPassword } = data;
        const { email, password } = user;

        const userForUpdate: Students | Teachers = await studentsService.findOneByEmail(email) ||
            await teachersService.findOneByEmail(email);

        if (!bcrypt.compareSync(oldPassword, password)) {
            throw new Unauthorized('Wrong password');
        }

        userForUpdate.password = hashFunc(newPassword);

        return userForUpdate.save();
    }

}

export const authService = new AuthService();
