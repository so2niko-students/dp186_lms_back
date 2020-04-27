import { Students } from './students.model';
import {groupsService} from '../groups/groups.service';
import {teachersService} from '../teachers/teachers.service';
import { BadRequest, NotFound } from '../../common/exeptions';
import {avatarService} from '../avatars/avatars.service';
import * as bcrypt from 'bcrypt';
import {Avatars} from '../avatars/avatars.model';
import {CustomUser} from '../../common/types/types';

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
    students.password = await bcrypt.hash(students.password, 10);

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

  public async findOneById(id: number) {
    const student = await Students.findOne({
      where: { id },
      include: [{
        model: Avatars, as: 'avatar', attributes: ['avatarLink'],
      }],
      attributes: {
          exclude: ['password'],
      },
    });

    return student;
  }
  public async updateOneOrThrow(data: IStudentsData, user: CustomUser) {
    const { id } = user;
    const student = await this.findOneById(id);
    if (!student) {
        throw new BadRequest(`User with id ${id} not found`);
    }
    const { avatar } = data;
    if (avatar) {
        const { img, format} = avatar;
        await avatarService.setAvatarToUserOrThrow(img, format, student);
    }
    Object.keys(data).forEach((k) => student[k] = data[k]);
    await student.save();
    return await this.findOneById(id);
  }
}

export const studentsService = new StudentsService();
