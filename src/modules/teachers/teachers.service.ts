import { Teachers } from './teachers.model';
import { Unauthorized, BadRequest, NotFound } from '../../common/exeptions';
import { CustomUser } from '../../common/types/types';
import { sequelize } from '../../database';

interface TeacherData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

class TeachersService {

  async createOneTeacher(teacherData: TeacherData, user: CustomUser): Promise<Teachers> {

    // superAdmin validation
    if (!user.isAdmin) {
      throw new Unauthorized('You do not have permission for this');
    }

    // duplicate validation
    if (await this.findOneByEmail(teacherData.email)) {
      throw new BadRequest('User with provided email already exists');
    }
    
    return await Teachers.create(teacherData);
  }

  async deleteOneById(id: number, user: CustomUser): Promise<number> {

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

  async findAllTeachers() : Promise<Teachers[]>{
    const teachers = await Teachers.findAll();

    return teachers;
  }

  async findOneByEmail(email: string){ // : Promise<Teachers> ????
    const teacher = await Teachers.findOne({
      where: { email },
    });

    return teacher;
  }

  async findOneById(id: number) {
    return await Teachers.findOne( { where: {id} } );
  }

  

  
}

export const teachersService = new TeachersService();
