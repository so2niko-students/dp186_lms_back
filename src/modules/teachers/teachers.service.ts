import { Teachers } from './teachers.model';
import { Unauthorized, BadRequest, NotFound } from '../../common/exeptions';
import { CustomUser } from '../../common/types/types';
import { sequelize } from '../../database';
import { hashFunc } from '../auth/password.hash';
import * as bcrypt from 'bcrypt';
import { IUpdatePassword } from '../../common/interfaces/auth.interfaces';

interface ITeachersData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

const UNAUTHORIZED_MSG = 'You do not have permission for this';


class TeachersService {

  public async createOneTeacher(teacherData: ITeachersData, user: CustomUser): Promise<Teachers> {

    // superAdmin validation
    if (!user.isAdmin) {
      throw new Unauthorized(UNAUTHORIZED_MSG);
    }

    // duplicate validation
    if (await this.findOneByEmail(teacherData.email)) {
      throw new BadRequest('User with provided email already exists');
    }

    const { password } = teacherData;

    teacherData.password = hashFunc(password);
    teacherData.isAdmin = false;
    
    return await Teachers.create(teacherData); // or myData if no mutation option
  }

  public async deleteOneById(id: number, user: CustomUser): Promise<number> {

    // superAdmin validation
    if (!user.isAdmin) {
      throw new Unauthorized(UNAUTHORIZED_MSG);
    }

    // exists in db validation
    if (!(await this.findOneById(id))) {
      throw new BadRequest('User with provided id do not exist in the db');
    }

    return await sequelize.transaction(async (transaction) => {  // important! PLS COMMEND IF TRANSACTION NEEDED IN THIS CASE
      const isExist = await Teachers.findOne({ where: { id }, transaction });
      if (!isExist) {
        throw new NotFound(`Can't find row the teacher with id ${id}`);
      }

      await Teachers.destroy({ where: { id }, transaction });
      return id;
    });
  }

  public async findAllTeachers(page: number = 1, limit: number) : Promise<object>{

    const amount = await Teachers.count(); // actual teachers count in db

    let offset = (page - 1) * limit // default offset by pages number

    if(amount <= offset) { // when you click 'next' and it should return page №1
      offset = 0;
      page = 1; 
    } else if(page === 0) {
      page = Math.ceil(amount / limit);
      offset = (page - 1) * limit; // when you click 'prev' and it should return the last page
    }

    const teachers = await Teachers.findAll({offset, limit});

    return {teachers, page};
  }

  public async findOneByEmail(email: string) {
    const teacher = await Teachers.findOne({
      where: { email },
    });

    return teacher;
  }

  public async findOneById(id: number) {
    const teacher = await Teachers.findOne({
      where: { id },
    });

    return teacher;
  }

  public async updateOne(id: number, data: Partial<ITeachersData>, user: Teachers) {
    if (id !== user.id && !user.isAdmin) {
      throw new Unauthorized('You cannot change another profile');
    }

    await Teachers.update(data, {where: {id}});

    return id;
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
