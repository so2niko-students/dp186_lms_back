import Students from "./students.model";
import Groups from "../groups/groups.model";
import Teachers from "../teachers/teachers.model";
import groupsService from "../groups/groups.service";
import teachersService from "../teachers/teachers.service";
import { BadRequest, NotFound } from "../../common/exeptions";
import * as bcrypt from "bcrypt";

class StudentsService {
  async createOne(studentsData) {
    const { groupId, email, groupToken } = studentsData;

    const isExistTeacherEmail = await teachersService.findOneByEmail(email);

    if (isExistTeacherEmail) {
      throw new BadRequest("User with provided email already exists");
    }

    const isExistSudentEmail = await this.findOneByEmail(email);

    if (isExistSudentEmail) {
      throw new BadRequest("User with provided email already exists");
    }

    const group = await groupsService.findOneById(groupId);

    if (!group) {
      throw new NotFound("Group not found");
    }

    if (group.groupToken !== groupToken) {
      throw new BadRequest("Not walid group token");
    }

    const students = new Students(studentsData);
    students.password = await bcrypt.hash(students.password, 10);

    return await students.save();
  }

  async findOneByEmail(email) {
    const student = await Students.findOne({
      where: { email },
    });

    return student;
  }

  async findOneById(id) {
    const student = await Students.findOne({ where: { id } });

    return student;
  }

  async findMany() {
    const students = Teachers.findAll({
      include: [{ model: Groups, include: [{ model: Students }] }],
    });

    if (!students) {
      throw new NotFound("Students not found");
    }

    return students;
  }
}

export default new StudentsService();
