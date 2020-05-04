import {Students} from './students.model';
import {groupsService} from '../groups/groups.service';
import {teachersService} from '../teachers/teachers.service';
import {BadRequest, NotFound} from '../../common/exeptions';
import * as bcrypt from 'bcrypt';
import {hashFunc} from "../auth/password.hash";
import Unauthorized from "../../common/exeptions/unauthorized";
import TokenFactory, {IToken} from "../../common/crypto/TokenFactory";
import {IUpdatePassword} from "../../common/interfaces/auth.interfaces";


interface IStudentsData {
    email: string;
    password: string;
    passwordConfirmation: string;
    firstNameUkr: string;
    lastNameUkr: string;
    phoneNumber: number;
    groupToken: string;
    firstNameEng: string;
    lastNameEng: string;
    groupId: number;
}

class StudentsService {
    public async createOne(studentsData: IStudentsData) {
        const {email, groupToken} = studentsData;

        if (await teachersService.findOneByEmail(email)) {
            throw new BadRequest('User with provided email already exists');
        }

        if (await this.findOneByEmail(email)) {
            throw new BadRequest('User with provided email already exists');
        }

        const group = await groupsService.findByTokenOrThrow(groupToken);

        if (!group) {
            throw new NotFound('Group not found');
        }

        studentsData.groupId = group.id;

        const students = new Students(studentsData);
        students.password = hashFunc(students.password);

        return students.save();
    }

    public async findOneByEmail(email: string) {
        return Students.findOne({
            where: {email},
        });
    }

    public async findOneById(id: number) {
        return Students.findOne({where: {id}});
    }


    public async updateOne(id: number, data: Partial<IStudentsData>, user: Students) {
        if (id !== user.id) {
            throw new Unauthorized('You cannot change another profile');
        }

        await Students.update(data, {where: {id}});

        return id;
    }

    public async setForgotPasswordToken(email: string): Promise<string> {
        //Generate and hash password token
        const student = await this.findOneByEmail(email);
        const token: IToken = TokenFactory.generateResetToken();
        student.resetPasswordExpire = Date.now() + (60 * 1000 * 360);
        student.resetPasswordToken = token.hashed;
        await student.save();
        return token.regular;
    }

    public async updatePassword({oldPassword, newPassword}: IUpdatePassword,
                                {email, password}: Students) {
        const userForUpdate: Students = await this.findOneByEmail(email);

        if (!bcrypt.compareSync(oldPassword, password)) {
            throw new Unauthorized('Wrong password');
        }

        userForUpdate.password = hashFunc(newPassword);

        return userForUpdate.save();
    }
}

export const studentsService = new StudentsService();
