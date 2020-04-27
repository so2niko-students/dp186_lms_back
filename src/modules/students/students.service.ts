import { Students } from './students.model';
import {groupsService} from '../groups/groups.service';
import {teachersService} from '../teachers/teachers.service';
import { BadRequest, NotFound, Unauthorized } from '../../common/exeptions';
import * as bcrypt from 'bcrypt';
import { PartialUpdateStudent } from '../../common/types/types';
import { sequelize } from '../../database';

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
    });

    return student;
  }

  public async findOneById(id: number) {
    const student = await Students.findOne({ where: { id } });

    return student;
  }

  public async updateOne(id: number, data: PartialUpdateStudent<IStudentsData>, user: Students) {
    if (id !== user.id) {
      throw new Unauthorized('You cannot change another profile');
    }

    return await sequelize.transaction(async (transaction) => {
      await Students.update(data, {where: {id}, transaction});
      return this.findOneById(id);
    });
  }
}

export const studentsService = new StudentsService();
