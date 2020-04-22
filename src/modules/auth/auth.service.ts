import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { auth } from './auth.config';
import { Unauthorized } from '../../common/exeptions/index';
import { studentsService } from '../../modules/students/students.service';
import { teachersService } from '../../modules/teachers/teachers.service';
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

    public async updatePassword({oldPassword, newPassword}) {
        
        const existingUser = await Students.findOne({
            where: { password: bcrypt.hashSync(oldPassword, 10) },
        });

        if (!existingStudent) {
            throw new  BadRequest('User with provided password does not exist');
        }

        existingStudent.password = bcrypt.hashSync(newPassword, 10);

        return existingStudent.save();
    }

    // public async updateTeacherPassword({oldPassword, newPassword}) {
    //     console.log(oldPassword, newPassword);
    //     const passport = bcrypt.hashSync(oldPassword, 10);
    //     console.log(passport);
        
    //     const existingTeacher = await Teachers.findOne({
    //         where: { password: bcrypt.hashSync(oldPassword, 10) },
    //     });

    //     if (!existingTeacher) {
    //         throw new  BadRequest('User with provided password does not exist');
    //     }

    //     existingTeacher.password = bcrypt.hashSync(newPassword, 10);

    //     return existingTeacher.save();
    // }

}

export const authService = new AuthService();



// $2b$10$y6R41bSS0ebb/Lnz68ezk.DFCUYHEUAyyAEoMEkAwgBH/ie5LM3ki