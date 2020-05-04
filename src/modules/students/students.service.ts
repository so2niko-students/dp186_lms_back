import { Students } from './students.model';
import { groupsService } from '../groups/groups.service';
import { teachersService } from '../teachers/teachers.service';
import { avatarService } from '../avatars/avatars.service';
import { BadRequest, NotFound, Unauthorized } from '../../common/exeptions';
import { hashFunc } from '../auth/password.hash';
import * as bcrypt from 'bcrypt';
import { Avatars } from '../avatars/avatars.model';
import { IUpdatePassword } from '../../common/interfaces/auth.interfaces';
import {sequelize} from '../../database';
import { Transaction } from 'sequelize';

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
  avatar?: {
    img: string;
    format: string;
  };
}

class StudentsService {
  public async createOne(studentsData: IStudentsData) {
    const { email, groupToken } = studentsData;

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

    return await students.save();
  }

  public async findOneByEmail(email: string) {
    const student = await Students.findOne({
      where: { email },
      include: [{
        model: Avatars, as: 'avatar', attributes: ['avatarLink'],
      }],
    });

    return student;
  }

  public async findOneByIdOrThrow(id: number, transaction: Transaction) {
    const student = await Students.findOne({
      where: { id },
      include: [{
        model: Avatars, as: 'avatar', attributes: ['avatarLink'],
      }],
      attributes: {
          exclude: ['password'],
      },
      transaction,
    });
    if (!student) {
      throw new BadRequest(`User with id ${id} not found`);
    }
    return student;
  }


  public async updateOneOrThrow(id: number, data: Partial<IStudentsData>, user: Students) {
      return sequelize.transaction(async (transaction) => {
          if (id !== user.id) {
              throw new Unauthorized('You cannot change another profile');
          }
          const student = await this.findOneByIdOrThrow(id, transaction);
          const { avatar } = data;
          if (avatar) {
              const { img, format} = avatar;
              await avatarService.setAvatarToUserOrThrow(img, format, student, transaction);
          }
          Object.keys(data).forEach((k) => student[k] = data[k]);
          await student.save({transaction});
          return this.findOneByIdOrThrow(id, transaction);
      });
  }

   public async updatePassword({ oldPassword, newPassword }: IUpdatePassword,
                               { email, password }: Students) {
    const userForUpdate: Students = await this.findOneByEmail(email);

    if (!bcrypt.compareSync(oldPassword, password)) {
        throw new Unauthorized('Wrong password');
    }

    userForUpdate.password = hashFunc(newPassword);

    return userForUpdate.save();

  }
}

export const studentsService = new StudentsService();
