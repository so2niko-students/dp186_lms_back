import { Teachers } from "./teachers.model";

class TeachersService {
  async findOneByEmail(email) {
    const teacher = await Teachers.findOne({
      where: { email },
    });
    console.log(teacher);

    return teacher;
  }

  async findOneById(id) {
    const teacher = await Teachers.findOne({ where: { id } });
    console.log(teacher);

    return teacher;
  }
}

export default new TeachersService();
