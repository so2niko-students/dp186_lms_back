import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { auth } from './auth.config';
import { Unauthorized } from '../../common/exeptions/index';
import { studentsService } from '../../modules/students/students.service';
import { teachersService } from '../../modules/teachers/teachers.service';
import BadRequest from '../../common/exeptions/bad-request';
import { Students } from '../students/students.model';

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

    public async updatePassword({oldPassword, newPassword}) {
        
        const existingUser = await Students.findOne({
            where: { password: bcrypt.hashSync(oldPassword, 10) },
        });

        if (!existingUser) {
            throw new  BadRequest('User with provided password does not exist');
        }

        existingUser.password = bcrypt.hashSync(newPassword, 10);

        return existingUser.save();
    }

}

export const authService = new AuthService();