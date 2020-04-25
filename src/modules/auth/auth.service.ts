import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { auth } from './auth.config';
import { Unauthorized } from '../../common/exeptions/index';
import { studentsService } from '../../modules/students/students.service';
import { teachersService } from '../../modules/teachers/teachers.service';
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

    public async updatePasswordStudent(data: IUpdatePassport, user: Students ) {
        return studentsService.updatePassword(data, user);
    }

    public async updatePasswordTeacher(data: IUpdatePassport, user: Teachers ) {
        return teachersService.updatePasswordTeacher(data, user);
    }

    public async updatePasswordSuperAdmin(id: number, data: IUpdatePassport, user: Teachers ) {
        return teachersService.updatePasswordSuperAdmin(id, data, user);
    }

}

export const authService = new AuthService();
