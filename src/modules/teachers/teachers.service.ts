import { Teachers } from './teachers.model';
import { Unauthorized, BadRequest, NotFound } from '../../common/exeptions';
import { CustomUser } from '../../common/types/types';
import { sequelize } from '../../database';
import { hashFunc } from '../auth/password.hash';

interface TeacherData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

class TeachersService {

  public async createOneTeacher(teacherData: TeacherData, user: CustomUser): Promise<Teachers> {

    // superAdmin validation
    if (!user.isAdmin) {
      throw new Unauthorized('You do not have permission for this');
    }

    // duplicate validation
    if (await this.findOneByEmail(teacherData.email)) {
      throw new BadRequest('User with provided email already exists');
    }

    // no mutation of teacherData
    // const { email, password, firstName, lastName, isAdmin } = teacherData;

    // const myData: TeacherData = {
    //   email,
    //   password: hashFunc(password),
    //   firstName,
    //   lastName,
    //   isAdmin
    // }

    // with mutation of teacherData
    const { password } = teacherData;

    teacherData.password = hashFunc(password);
    
    return await Teachers.create(teacherData); // or myData if no mutation option
  }

  public async deleteOneById(id: number, user: CustomUser): Promise<number> {

    // superAdmin validation
    if (!user.isAdmin) {
      throw new Unauthorized('You do not have permission for this');
    }

    // exists in db validation
    if (!(await this.findOneById(id))) {
      throw new BadRequest('User with provided id do not exist in the db');
    }

    return await sequelize.transaction(async (transaction) => {
      const isExist = await Teachers.findOne({ where: { id }, transaction });
      if (!isExist) {
        throw new NotFound(`Can't find row the teacher with id ${id}`);
      }

      await Teachers.destroy({ where: { id }, transaction });
      return id;
    });
  }

  public async findAllTeachers(offset: number, limit: number) : Promise<Teachers[]>{

    const teachers = await Teachers.findAll({offset, limit});

    return teachers;
  }

  public async findOneByEmail(email: string){ // : Promise<Teachers> ????
    const teacher = await Teachers.findOne({
      where: { email },
    });

    return teacher;
  }

  public async findOneById(id: number) {
    return await Teachers.findOne( { where: {id} } );
  }
}

export const teachersService = new TeachersService();
