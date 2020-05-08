import { Teachers } from './teachers.model';
import { Students } from '../students/students.model';
import { Groups } from '../groups/groups.model';
import { groupsService } from '../groups/groups.service';
import { studentsService } from '../students/students.service';
import { BadRequest } from '../../common/exeptions';
import { CustomUser } from '../../common/types/types';
import { NotFound, Unauthorized } from '../../common/exeptions/';
import { Avatars } from '../avatars/avatars.model';
import { avatarService } from '../avatars/avatars.service';
import { IUpdatePassword } from '../../common/interfaces/auth.interfaces';
import { sequelize } from '../../database';
import { hashFunc } from '../auth/password.hash';
import * as bcrypt from 'bcrypt';
import { Transaction } from 'sequelize/types';
import { paginationService } from '../pagination/pagination.service';
import { ITeachersData } from '../../common/interfaces/teachers.interfaces';
import { IPaginationOuterData } from '../../common/interfaces/pagination.interfaces';
import { TokenService } from "../../common/crypto/TokenService";


const NO_PERMISSION_MSG = 'You do not have permission for this';


class TeachersService {

    public async createOne(teacherData: ITeachersData, user: CustomUser): Promise<Teachers> {

        return sequelize.transaction(async (transaction) => {
            // superAdmin validation
            if (!user.isAdmin) {
                throw new Unauthorized(NO_PERMISSION_MSG);
            }

            // duplicate validation
            if (await this.findOneByEmail(teacherData.email, transaction)) {
                throw new BadRequest('User with provided email already exists');
            }

            const result: Teachers = await Teachers.create(teacherData, {transaction: transaction});

            delete result.password;

            return result
        });

    }

    public async deleteOneById(id: number, user: CustomUser): Promise<number> {

        // superAdmin validation
        if (!user.isAdmin) {
            throw new Unauthorized(NO_PERMISSION_MSG);
        }

        return sequelize.transaction(async (transaction) => {
            const teacher = await Teachers.findOne({where: {id}, transaction});
            if (!teacher) {
                throw new NotFound(`Can't find the teacher with id ${id}`);
            }

            await Teachers.destroy({where: {id}, transaction});
            return id;
        });
    }

    public async setForgotPasswordToken(email: string): Promise<string> {
        const teacher = await this.findOneByEmail(email);
        const token: string = new TokenService().generateResetToken();
        teacher.resetPasswordExpire = Date.now() + (60 * 1000 * 360);
        teacher.resetPasswordToken = token;
        await teacher.save();
        return token;
    }

    public findTeacherByToken(token: string): Promise<Teachers> {
        return Teachers.findOne({
            where: {resetPasswordToken: token},
        });
    }

    public async resetPassword(password: string, token: string): Promise<void> {
        const user = await this.findTeacherByToken(token);
        if (!user) {
            throw new NotFound('User for your token does not exist')
        }
        user.password = hashFunc(password);
        user.resetPasswordToken = null;
        user.resetPasswordExpire = Date.now();

        await user.save();
    }

    public async findOneByEmail(email: string, transaction?: Transaction) {
        return Teachers.findOne({
            where: {email},
            include: [{
                model: Avatars, as: 'avatar', attributes: ['avatarLink'],
            }],
            transaction,
        });
    }

    public async findOneById(id: number, transaction?: Transaction) {
        return Teachers.findOne({
            where: {id},
            include: [{
                model: Avatars, as: 'avatar', attributes: ['avatarLink'],
            }],
            attributes: {exclude: ['password']},
            transaction,
        });
    }

    public async findAll(page: number = 1, limit: number = 10) : Promise<IPaginationOuterData<Teachers>>{

      const total: number = await Teachers.count(); // actual teachers count in db
      const { offset, actualPage } = await paginationService.getOffset(page, limit, total);
      page = actualPage;
      let data: Teachers[] = await Teachers.findAll({offset, limit});

      const groupsData: Groups[] = await groupsService.findAllByMentorsIdsArray(data.map(e => e.id)) // take necessary groups info out from db
      let totalGroupsIdsSet = new Set([]); // Set collection of unique group IDs for all teachers
      data = this.addGroupsCount(data, groupsData, totalGroupsIdsSet); // add in the data studentsCount field with the value

      const totalGroupsIdsArr = [];
      totalGroupsIdsSet.forEach(e => totalGroupsIdsArr.push(e));

      const studentsData: Students[] = await studentsService.findAllByGroupsIdsArray(totalGroupsIdsArr) // take necessary students info out from db
      data = this.addStudentsCount(data, groupsData, studentsData); // add in the data studentsCount field with the value

      return { data, page, total, limit };
    }

    public addGroupsCount(data: Teachers[], groupsData: Groups[], totalGroupsIdsSet: Set<number>): Teachers[] {
      data.forEach(item => {
        let groupsSet: Set<number> = new Set([]); // Set collection of unique group IDs

        // fulfill Set collection of unique group IDs
        groupsData.forEach(group => {
          if (item.id === group.teacherId) {
            groupsSet.add(group.id);
            totalGroupsIdsSet.add(group.id);
          }
        });

        const groupsCount: number = groupsSet.size; // groups count
        // give a teacher object prop for students quantity
        item.groupsCount = groupsCount;
      });

      return data
    }

    public addStudentsCount(data: Teachers[], groupsData: Groups[], studentsData: Students[]): Teachers[] {
      data.forEach(item => {
        let groupsSet: Set<number> = new Set([]); // Set collection of unique group IDs

        // fulfill Set collection of unique group IDs
        groupsData.forEach(group => {
          if (item.id === group.teacherId) {
            groupsSet.add(group.id);
          }
        });

        let studentsCount: number = 0; // define students counter

        // iterate students counter if the id of group === student.groupId
        groupsSet.forEach(groupId => {
          studentsData.forEach(student => {
            if (groupId === student.groupId) {
              studentsCount++;
            }
          });
        });

        // give a teacher object prop for students quantity
        item.studentsCount = studentsCount;
      });

      return data
    }

    public async updateOneOrThrow(id: number, data: ITeachersData, user: Teachers): Promise<Teachers> {
        return sequelize.transaction(async (transaction: Transaction) => {
            if (id !== user.id && !user.isAdmin) {
                throw new Unauthorized('You cannot change another profile');
            }
            const teacher: Teachers = await this.findOneById(id, transaction);
            if (user.isAdmin && !teacher) {
                throw new NotFound(`There is no teacher with id ${id}`);
            }
            const {avatar} = data;
            if (avatar) {
                const {img, format} = avatar;
                await avatarService.setAvatarToUserOrThrow(img, format, teacher, transaction);
            }
            await Teachers.update(data, {where: {id}, transaction});
            return this.findOneById(id, transaction);
        });
      }

    public async updatePassword({oldPassword, newPassword}: IUpdatePassword,
                                user: Teachers): Promise<Teachers> {
        const userForUpdate: Teachers = await this.findOneById(user.id);

        if (!bcrypt.compareSync(oldPassword, user.password)) {
            throw new Unauthorized('Wrong password');
        }

        userForUpdate.password = hashFunc(newPassword);

        return userForUpdate.save();
    }

    public async updatePasswordBySuperAdmin(id: number,
                                            {newPassword}: IUpdatePassword, user: Teachers): Promise<Teachers> {
        if (!user.isAdmin) {
            throw new Unauthorized('You cannot change password for another teacher');
        }

        const userForUpdate: Teachers = await this.findOneById(id);

        userForUpdate.password = hashFunc(newPassword);

        return userForUpdate.save();
    }
}

export const teachersService = new TeachersService();
