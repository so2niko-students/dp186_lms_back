import { Groups } from './groups.model';
import { NotFound, BadRequest, Forbidden } from '../../common/exeptions/';
import { hashSync, genSaltSync } from 'bcrypt';
import {GroupWithStudents, CustomUser} from '../../common/types/types';
import {teachersService} from '../teachers/teachers.service';
import {avatarService} from '../avatars/avatars.service';
import {Avatars} from '../avatars/avatars.model';
import {Transaction} from 'sequelize';
import {sequelize} from '../../database';
import {Teachers} from '../teachers/teachers.model';
import {Students} from '../students/students.model';
import {Group} from 'nodemailer/lib/addressparser';

const NO_RIGHTS = 'You do not have rights to do this.';
const NO_TIGHTS_TO_UPDATE = 'Only teacher or super admin can update group.';

interface ICreateGroup {
    groupName?: string;
    groupToken?: string;
    teacherId?: number;
    avatar?: {
        img: string;
        format: string;
    };
}


class GroupsService {
    public async createOne({ groupName, teacherId }, user: CustomUser) {
        this.checkIsMentorOrThrow(user);
        if (teacherId && !user.isAdmin) {
            throw new Forbidden(NO_RIGHTS);
        }
        const group = await Groups.findOne( { where: {groupName}} );
        if (group) {
            throw new BadRequest(`Group with name "${groupName} already exists`);
        }
        const groupToken = await this.createGroupToken(groupName);
        if (teacherId) {
            const teacher = await teachersService.findOneById(teacherId);
            if (!teacher) {
                throw new BadRequest(`Teacher with id "${teacherId} not found`);
            }
            return Groups.create({groupName, groupToken, teacherId});
        }
        return Groups.create({groupName,  groupToken, teacherId: user.id});
    }
    public async findOneOrThrow(id: number, user: CustomUser, transaction ?: Transaction) {
        if (user.groupId !== id && !user.isMentor) {
            throw new Forbidden(NO_RIGHTS);
        }
        const group: GroupWithStudents = await Groups.findOne({
            include: [
                {
                    model: Avatars, as: 'avatar', attributes: ['avatarLink'],
                },
                {
                    model: Teachers, as: 'teacher', attributes: {exclude: ['password']},
                    include: [ { model: Avatars, as: 'avatar', attributes: ['avatarLink'] } ],
                },
                {
                    model: Students, as: 'students',
                    include: [ { model: Avatars, as: 'avatar', attributes: ['avatarLink'] } ],
                },
            ],
            where: {id},
            transaction,
        });
        if (!group) {
            throw new NotFound(`Group with ${id} not found.`);
        }
        return group;
    }
    public async findByTokenOrThrow(groupToken: string) {
        const group = await Groups.findOne({ where: { groupToken } });
        if (!group) {
            throw new NotFound('Group not found');
        }
        return group;
    }
    public async updateOneOrThrow(id: number, data: Partial<ICreateGroup>, user: CustomUser) {
        return sequelize.transaction(async (transaction: Transaction) => {
            this.checkIsMentorOrThrow(user);
            const group = await this.findOneOrThrow(id, user, transaction);
            if (group.teacherId !== user.id && !user.isAdmin) {
                throw new Forbidden(NO_TIGHTS_TO_UPDATE);
            }
            if (data.teacherId && !user.isAdmin) {
                throw new Forbidden(NO_TIGHTS_TO_UPDATE);
            }
            const { avatar } = data;
            if (avatar) {
                const { img, format } = avatar;
                await avatarService.setAvatarToGroupOrThrow(img, format, group, transaction);
            }
            Object.keys(data).forEach((k) => group[k] = data[k]);
            await group.save({transaction});
            return this.findOneOrThrow(id, user, transaction);
        });
    }
    public async deleteOne(id: number, user: CustomUser) {
        return sequelize.transaction(async (transaction: Transaction) => {
            this.checkIsMentorOrThrow(user);
            const group = await this.findOneOrThrow(id, user, transaction);
            if (group.teacherId !== user.id && !user.isAdmin) {
                throw new Forbidden(NO_RIGHTS);
            }
            group.destroy({transaction});
            return group;
        });
    }
    public async findMany(mentorId: number, user: CustomUser) {
        if (!user.isMentor) {
            return Groups.findAll({
                where: {id: user.groupId},
                include: [
                    {
                        model: Avatars, as: 'avatar', attributes: ['avatarLink'],
                    },
                    {
                        model: Teachers, as: 'teacher', attributes: {exclude: ['password']},
                        include: [ { model: Avatars, as: 'avatar', attributes: ['avatarLink'] } ],
                    },
                    {
                        model: Students, as: 'students',
                        include: [ { model: Avatars, as: 'avatar', attributes: ['avatarLink'] } ],
                    },
                ],
            });
        }
        if (mentorId) {
            return Groups.findAll({
              where: {teacherId: mentorId},
                include: [
                    {
                        model: Avatars, as: 'avatar', attributes: ['avatarLink'],
                    },
                    {
                        model: Teachers, as: 'teacher', attributes: {exclude: ['password']},
                        include: [ { model: Avatars, as: 'avatar', attributes: ['avatarLink'] } ],
                    },
                    {
                        model: Students, as: 'students',
                        include: [ { model: Avatars, as: 'avatar', attributes: ['avatarLink'] } ],
                    },
                ],
            });
        }
        if (!user.isAdmin) {
            return Groups.findAll({
                where: {teacherId: user.id},
                include: [
                    {
                        model: Avatars, as: 'avatar', attributes: ['avatarLink'],
                    },
                    {
                        model: Teachers, as: 'teacher', attributes: {exclude: ['password']},
                        include: [ { model: Avatars, as: 'avatar', attributes: ['avatarLink'] } ],
                    },
                    {
                        model: Students, as: 'students',
                        include: [ { model: Avatars, as: 'avatar', attributes: ['avatarLink'] } ],
                    },
                ],
            });
        }
        return Groups.findAll({
            include: [
                {
                    model: Avatars, as: 'avatar', attributes: ['avatarLink'],
                },
                {
                    model: Teachers, as: 'teacher', attributes: {exclude: ['password']},
                    include: [ { model: Avatars, as: 'avatar', attributes: ['avatarLink'] } ],
                },
                {
                    model: Students, as: 'students',
                    include: [ { model: Avatars, as: 'avatar', attributes: ['avatarLink'] } ],
                },
            ],
        });
    }
    // method to count groups in UI
    public async findAllByMentorId(mentorId: number, user: CustomUser) {
        if (!user.isMentor) {
            throw new Forbidden(NO_RIGHTS);
        }
        const groups = await Groups.findAll({
            where: { teacherId: mentorId },
            attributes: ['id'],
        });
        return {groups, count: groups.length};
    }
    private async createGroupToken(name: string): Promise<string> {
        const salt = genSaltSync(5, 'b');
        const hash = hashSync(name, salt);
        return hash.replace(/\//g, 'slash');
    }
    private checkIsMentorOrThrow(user: CustomUser): void {
        const { isMentor } = user;
        if (!isMentor) {
            throw new Forbidden(NO_RIGHTS);
        }
    }
}

export const groupsService = new GroupsService();
