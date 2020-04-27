import { Teachers } from './teachers.model';
import { Unauthorized, BadRequest, NotFound } from '../../common/exeptions';

interface TeacherData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

class TeachersService {

  async createOneTeacher(body: TeacherData) : Promise<Teachers> {

    if (await this.findOneByEmail(body.email)) {
      throw new BadRequest('User with provided email already exists');
    }
    
    return await Teachers.create(body);
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

  

  async deleteOneById(id: number) {
    const teacher = await Teachers.findOne( { where: {id} } );
    if (!(typeof teacher == 'object')) {
     throw new NotFound('no id u set exists');
    }
    return await Teachers.destroy( { where: {id} } );
  }
}

export const teachersService = new TeachersService();
