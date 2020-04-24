import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { auth } from './auth.config';
import { Unauthorized } from '../../common/exeptions/index';
import { studentsService } from '../../modules/students/students.service';
import { teachersService } from '../../modules/teachers/teachers.service';
import { hashFunc } from './password.hash';
import { Students } from '../students/students.model';
import { Teachers } from '../teachers/teachers.model';

interface ILogin {
    email: string;
    password: string;
}

interface IUpdatePassport {
    oldPassword?: string;
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

    public async updateStudentPassword(data: IUpdatePassport, user: Students) {
        const { oldPassword, newPassword } = data;
        const { email, password } = user;
        const userForUpdate: Students = await studentsService.findOneByEmail(email);

        if (!bcrypt.compareSync(oldPassword, password)) {
            throw new Unauthorized('Wrong password');
        }

        userForUpdate.password = hashFunc(newPassword);

        return userForUpdate.save();
    }

    public async updateTeacherPassword(id: number, data: IUpdatePassport, user: Teachers) {
        const { oldPassword, newPassword } = data;
        const userForUpdate: Teachers = await teachersService.findOneById(id);

        if (user.isAdmin) {
            userForUpdate.password = hashFunc(newPassword);

            return userForUpdate.save();
        }

        if (!(user.id === id)) {
            throw new Unauthorized('You cannot change password for another teacher');
        }

        if (!bcrypt.compareSync(oldPassword, user.password)) {
            throw new Unauthorized('Wrong password');
        }

        userForUpdate.password = hashFunc(newPassword);

        return userForUpdate.save();
    }

}

export const authService = new AuthService();
