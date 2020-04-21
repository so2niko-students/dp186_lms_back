import { Students } from './students.model';
import groupsService from '../groups/groups.service';
import teachersService from '../teachers/teachers.service';
import { BadRequest, NotFound } from '../../common/exeptions';
import * as bcrypt from 'bcrypt';

interface IstudentsData {
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
  public async createOne(studentsData: IstudentsData) {
    const { email, groupToken } = studentsData;

    const isExistTeacherEmail = await teachersService.findOneByEmail(email);

    if (isExistTeacherEmail) {
      throw new BadRequest('User with provided email already exists');
    }

    const isExistSudentEmail = await this.findOneByEmail(email);

    if (isExistSudentEmail) {
      throw new BadRequest('User with provided email already exists');
    }

    const group = await groupsService.findOneByToken(groupToken);

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
}

export const studentsService = new StudentsService();
