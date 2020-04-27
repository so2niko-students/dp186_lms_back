import { Teachers } from './teachers.model';
import { Unauthorized } from '../../common/exeptions';

// some interface for req.body

class TeachersService {

  async findAllTeachers(){ // : Promise<Teachers[]> ????
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

  async createOneTeacher(body) {
    return await Teachers.create(body);
  }

  // async deleteOneById(id: number) {
  //   const teacher = await Teachers.findOne( { where: {id} } );
  //   if (!(typeof teacher == 'object')) {
  //    throw new NotFound('no id u set exists');
  //   }
  //   return await Teachers.destroy( { where: {id} } );
  // }
}

export const teachersService = new TeachersService();
