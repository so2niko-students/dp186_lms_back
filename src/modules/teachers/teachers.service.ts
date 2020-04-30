import { Teachers } from './teachers.model';
import { NotFound, Unauthorized } from '../../common/exeptions/';
import { Avatars } from '../avatars/avatars.model';
import { Transaction } from 'sequelize';
import { avatarService } from '../avatars/avatars.service';
import { hashFunc } from '../auth/password.hash';
import * as bcrypt from 'bcrypt';
import { IUpdatePassword } from '../../common/interfaces/auth.interfaces';
import {sequelize} from '../../database';

interface ITeachersData {
    firstName?: string;
    lastName?: string;
    email?: string;
    isAdmin?: boolean;
    avatar?: {
        img: string;
        format: string;
    };
}

class TeachersService {
    public async findOneByEmail(email: string) {
        const teacher = await Teachers.findOne({
            where: {email},
            include: [{
                model: Avatars, as: 'avatar', attributes: ['avatarLink'],
            }],
        });

        return teacher;
    }

    public async findOneById(id) {
        const teacher = await Teachers.findOne({
            where: {id},
            include: [{
                model: Avatars, as: 'avatar', attributes: ['avatarLink'],
            }],
        });

        return teacher;
    }

    public async findOneByIdOrThrow(id: number, transaction?: Transaction): Promise<Teachers> {
        const teacher = await Teachers.findOne({
            where: {id},
            include: [{
                model: Avatars, as: 'avatar', attributes: ['avatarLink'],
            }],
            attributes: {exclude: ['password']},
            transaction,
        });
        if (!teacher) {
            throw new NotFound(`Teacher with ${id} not found`);
        }
        return teacher;
    }

    public async updateOneOrThrow(id: number, data: ITeachersData, user: Teachers) {
        return sequelize.transaction(async (transaction: Transaction) => {
            if (id !== user.id && !user.isAdmin) {
                throw new Unauthorized('You cannot change another profile');
            }
            const teacher = await this.findOneByIdOrThrow(id, transaction);
            const {avatar} = data;
            if (avatar) {
                const {img, format} = avatar;
                await avatarService.setAvatarToUserOrThrow(img, format, teacher, transaction);
            }
            Object.keys(data).forEach((k) => teacher[k] = data[k]);
            await teacher.save({transaction});
            return this.findOneByIdOrThrow(id, transaction);
        });
    }

    public async updatePassword({oldPassword, newPassword}: IUpdatePassword,
                                user: Teachers) {
        const userForUpdate: Teachers = await this.findOneById(user.id);

        if (!bcrypt.compareSync(oldPassword, user.password)) {
            throw new Unauthorized('Wrong password');
        }

        userForUpdate.password = hashFunc(newPassword);

        return userForUpdate.save();
    }

    public async updatePasswordBySuperAdmin(id: number,
                                            {newPassword}: IUpdatePassword, user: Teachers) {
        if (!user.isAdmin) {
            throw new Unauthorized('You cannot change password for another teacher');
        }

        const userForUpdate: Teachers = await this.findOneById(id);

        userForUpdate.password = hashFunc(newPassword);

        return userForUpdate.save();
    }
}

export const teachersService = new TeachersService();
