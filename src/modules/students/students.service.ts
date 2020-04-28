import { Students } from './students.model';
import { groupsService } from '../groups/groups.service';
import { teachersService } from '../teachers/teachers.service';
import { BadRequest, NotFound, Forbidden } from '../../common/exeptions';
import * as bcrypt from 'bcrypt';
import { CustomUser } from '../../common/types/types';

const NO_RIGHTS = 'You do not have rights to do this.';

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

  public async deleteStudents(users, user: CustomUser ) {
      if (!user.isMentor) {
          throw new Forbidden(NO_RIGHTS);
      }

      const res = await Students.destroy({where: {
        id: users
      }});

      return res;
  }
}

export const studentsService = new StudentsService();
