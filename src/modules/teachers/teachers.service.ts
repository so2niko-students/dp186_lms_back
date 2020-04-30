import { Teachers } from './teachers.model';
import { Unauthorized, BadRequest, NotFound } from '../../common/exeptions';
import { CustomUser } from '../../common/types/types';
import { sequelize } from '../../database';
import { hashFunc } from '../auth/password.hash';
import * as bcrypt from 'bcrypt';
import { IUpdatePassword } from '../../common/interfaces/auth.interfaces';
import { Transaction } from 'sequelize/types';
import { paginationService } from '../pagination/pagination.service'

interface ITeachersData {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  isAdmin: boolean;
}

const NO_PERMISSION_MSG = 'You do not have permission for this';


class TeachersService {

  public async createOne(teacherData: ITeachersData, user: CustomUser): Promise<Teachers> {

    // superAdmin validation
    if (!user.isAdmin) {
      throw new Unauthorized(NO_PERMISSION_MSG);
    }

    // duplicate validation
    if (await this.findOneByEmail(teacherData.email)) {
      throw new BadRequest('User with provided email already exists');
    }

    const { password } = teacherData;

    teacherData.password = hashFunc(password);
    teacherData.isAdmin = false;
    
    const result: Teachers = await Teachers.create(teacherData); // what should i return ?

    delete result.password

    return result
  }

  public async deleteOneById(id: number, user: CustomUser): Promise<number> {

    // superAdmin validation
    if (!user.isAdmin) {
      throw new Unauthorized(NO_PERMISSION_MSG);
    }

    return sequelize.transaction(async (transaction) => {
      const teacher = await Teachers.findOne({ where: { id }, transaction });
      if (!teacher) {
        throw new NotFound(`Can't find the teacher with id ${id}`);
      }

      await Teachers.destroy({ where: { id }, transaction });
      return id;
    });
  }

  public async getPage(supposedPage: number = 1, limit: number = 10) : Promise<object>{

    const total: number = await Teachers.count(); // actual teachers count in db
    const {offset, actualPage} = await paginationService.getPaginationOffset(supposedPage, limit, total);
    const teachers: Teachers[] = await Teachers.findAll({offset, limit});

    return {teachers, actualPage, total};
  }

  public async findOneByEmail(email: string) {
    const teacher = await Teachers.findOne({
      where: { email },
      // attributes: {exclude: ['password']},
    });

    return teacher;
  }

  public async findOneById(id: number) {
    const teacher = await Teachers.findOne({
      where: { id },
      // attributes: {exclude: ['password']},
    });

    return teacher;
  }

  public async updateOne(id: number, data: Partial<ITeachersData>, user: Teachers) {
    if (id !== user.id && !user.isAdmin) {
      throw new Unauthorized('You cannot change another profile');
    }

    return sequelize.transaction(async (transaction) => {
      const teacher = await Teachers.findOne({ where: { id }, transaction });

      if (!teacher) {
        throw new NotFound(`Can't find the teacher with id ${id}`);
      }

      await Teachers.update(data, { where: { id }, transaction });
      return id;
    });
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
