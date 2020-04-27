import { Groups } from './groups.model';
import { NotFound, BadRequest, Forbidden } from '../../common/exeptions/';
import { hashSync, genSaltSync } from 'bcrypt';
import {CustomUser} from '../../common/types/types';
import {teachersService} from '../teachers/teachers.service';
import {avatarService} from '../avatars/avatars.service';
import {Avatars} from '../avatars/avatars.model';
import {Transaction} from 'sequelize';
import * as Joi from 'joi';

const NO_RIGHTS = 'You do not have rights to do this.';
interface IUpdateGroup {
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
        const mentor = await this.mentorVerification(user);
        if (teacherId && !mentor.isAdmin) {
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
        const group = Groups.findOne({
            include: [{
               model: Avatars, as: 'avatar', attributes: ['avatarLink'],
            }],
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
    public async updateOneOrThrow(id: number, data: IUpdateGroup, user: CustomUser) {
        const mentor = await this.mentorVerification(user);
        const group = await this.findOneOrThrow(id, user);
        if (group.teacherId !== mentor.id && !mentor.isAdmin) {
            throw new Forbidden(NO_RIGHTS);
        }
        if (data.teacherId && !mentor.isAdmin) {
            throw new Forbidden(NO_RIGHTS);
        }
        const { avatar } = data;
        if (avatar) {
            const { img, format } = avatar;
            await avatarService.setAvatarToGroupOrThrow(img, format, group);
        }
        Object.keys(data).forEach((k) => group[k] = data[k]);
        await group.save();
        return await this.findOneOrThrow(id, user);
    }
    public async deleteOne(id: number, user: CustomUser) {
        const mentor = await this.mentorVerification(user);
        const group = await this.findOneOrThrow(id, user);
        if (group.teacherId !== mentor.id && !mentor.isAdmin) {
            throw new Forbidden(NO_RIGHTS);
        }
        group.destroy();
        return group;
    }
    public async findMany(user: CustomUser) {
        if (!user.isMentor) {
            return Groups.findAll({ where: {id: user.groupId} });
        }
        return Groups.findAll({
            include: [{
                model: Avatars, as: 'avatar', attributes: ['avatarLink'],
            }],
        });
    }
    private async createGroupToken(name: string): Promise<string> {
        const salt = genSaltSync(5, 'b');
        const hash = hashSync(name, salt);
        return hash.replace(/\//g, 'slash');
    }
    private async mentorVerification(user: CustomUser) {
        const { isMentor } = user;
        if (!isMentor) {
            throw new Forbidden(NO_RIGHTS);
        }
        return user;
    }
}

export const groupsService = new GroupsService();
