import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { auth } from './auth.config';
import { Unauthorized } from '../../common/exeptions/index';
import studentsService from '../../modules/students/students.service';
import teachersService from '../../modules/teachers/teachers.service';
import { Students } from '../students/students.model';
import { Teachers } from '../teachers/teachers.model';
import BadRequest from '../../common/exeptions/bad-request';

class AuthService {
    public async login({email, password}) {
        const user = await studentsService.findOneByEmail(email) ||
            await teachersService.findOneByEmail(email);

        if (!bcrypt.compareSync(password, user.password)) {
            throw new Unauthorized('Wrong password');
        }
        const token = jwt.sign({ id: user.id, email: user.email }, auth.secretKey);
        return {
            token,
            expires: auth.expiresIn,
        };
    }

    public async updateStudentPassword({oldPassword, newPassword}) {
        const existingStudent = await Students.findOne({
            where: { password: bcrypt.hashSync(oldPassword, 10) },
        });

        if (!existingStudent) {
            throw new BadRequest(`User with provided password doesn't exist`);
        }

        existingStudent.password = bcrypt.hashSync(newPassword, 10);

        return existingStudent.save();
    }

    public async updateTeacherPassword({oldPassword, newPassword}) {
        const existingTeacher = await Teachers.findOne({
            where: { password: bcrypt.hashSync(oldPassword, 10) },
        });

        if (!existingTeacher) {
            throw new BadRequest(`User with provided password doesn't exist`);
        }

        existingTeacher.password = bcrypt.hashSync(newPassword, 10);

        return existingTeacher.save();
    }

}

export const authService = new AuthService();
