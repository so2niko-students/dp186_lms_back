import { Teachers } from './teachers.model';
import { NotFound, Unauthorized } from '../../common/exeptions/';
import { Avatars } from '../avatars/avatars.model';
import { Transaction } from 'sequelize';
import { CustomUser } from '../../common/types/types';
import { avatarService} from '../avatars/avatars.service';
import { hashFunc } from '../auth/password.hash';
import { IUpdatePassword } from '../../common/interfaces/auth.interfaces';

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
            where: { email },
            include: [{
                model: Avatars, as: 'avatar', attributes: ['avatarLink'],
            }],
        });

        return teacher;
    }

    public async findOneById(id) {
        const teacher = await Teachers.findOne({
            where: { id },
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
    public async updateOneOrThrow(data: ITeachersData, user: CustomUser) {
        const { id } = user;
        const teacher = await this.findOneByIdOrThrow(id);
        const { avatar } = data;
        if (avatar) {
            const { img, format} = avatar;
            await avatarService.setAvatarToUserOrThrow(img, format, teacher);
        }
        Object.keys(data).forEach((k) => teacher[k] = data[k]);
        await teacher.save();
        return await this.findOneByIdOrThrow(id);
    }
    return teacher;
  }

  public async updatePassword({ oldPassword, newPassword }: IUpdatePassword,
                              user: Teachers) {
    const userForUpdate: Teachers = await this.findOneById(user.id);

    if (!bcrypt.compareSync(oldPassword, user.password)) {
        throw new Unauthorized('Wrong password');
    }

    userForUpdate.password = hashFunc(newPassword);

    return userForUpdate.save();
  }

  public async updatePasswordBySuperAdmin(id: number,
                                          { newPassword }: IUpdatePassword, user: Teachers) {
    const userForUpdate: Teachers = await this.findOneById(id);

    if (!user.isAdmin) {
        throw new Unauthorized('You cannot change password for another teacher');
    }

    userForUpdate.password = hashFunc(newPassword);

    return userForUpdate.save();
  }
}

export const teachersService = new TeachersService();
