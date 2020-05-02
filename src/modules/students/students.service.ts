import { Students } from './students.model';
import {groupsService} from '../groups/groups.service';
import {teachersService} from '../teachers/teachers.service';
import { BadRequest, NotFound, Unauthorized } from '../../common/exeptions';
import { hashFunc } from '../auth/password.hash';
import * as bcrypt from 'bcrypt';
import { IUpdatePassword } from '../../common/interfaces/auth.interfaces';


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
    students.password = hashFunc(students.password);

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


  public async updateOne(id: number, data: Partial<IStudentsData>, user: Students) {
      if (id !== user.id) {
          throw new Unauthorized('You cannot change another profile');
      }

      await Students.update(data, {where: {id}});

      return id;
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

    public async findAllByGroupId(id: number): Promise<Students[]> {
        const students = await Students.findAll({ where: { groupId:id } });

        return students;
    }
}

export const studentsService = new StudentsService();
