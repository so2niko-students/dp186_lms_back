import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { auth } from './auth.config';
import { Unauthorized } from '../../common/exeptions/index';
import { studentsService } from '../../modules/students/students.service';
import { teachersService } from '../../modules/teachers/teachers.service';
import { Students } from '../students/students.model';
import { Teachers } from '../teachers/teachers.model';
import { ILogin, IUpdatePassword } from '../../common/interfaces/auth.interfaces';

class AuthService {
    public async login({ email, password }: ILogin) {
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

    public async updateStudentPassword(data: IUpdatePassword, user: Students ) {
        return studentsService.updatePassword(data, user);
    }

    public async updateTeacherPassword(data: IUpdatePassword, user: Teachers ) {
        return teachersService.updatePassword(data, user);
    }

    public async updateTeacherPasswordBySuperAdmin(id: number,
                                                   data: IUpdatePassword, user: Teachers ) {
        return teachersService.updatePasswordBySuperAdmin(id, data, user);
    }

}

export const authService = new AuthService();
