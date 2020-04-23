import { Groups } from './groups.model';
import { NotFound, BadRequest, Unauthorized } from '../../common/exeptions/';
import { hashSync, genSaltSync } from 'bcrypt';
import {CustomUser} from '../../common/types/types';
import {teachersService} from '../teachers/teachers.service';

interface IGroupCreate {
    groupName: string;
    teacherId?: number;
    groupToken?: string;
}

class GroupsService {
    public async createOne(data: IGroupCreate, user: CustomUser) {
        const mentor = await this.mentorVerification(user);
        const { groupName, teacherId } = data;
        const group = await Groups.findOne( { where: {groupName}} );
        if (group) {
            throw new BadRequest(`Group with name "${groupName} already exists`);
        }
        if (teacherId && !mentor.isAdmin) {
            throw new Unauthorized('You do not have the right to establish another teacher as a mentor of a new group.');
        }
        data.groupToken = await this.createGroupToken(groupName);
        if (teacherId) {
            const teacher = await teachersService.findOneById(teacherId);
            if (!teacher) {
                throw new BadRequest(`Teacher with id "${teacherId} not found`);
            }
            return Groups.create({groupName, groupToken: data.groupToken, teacherId});
        }
        return Groups.create({groupName,  groupToken: data.groupToken});
    }
    public async findOne(id: number, user: CustomUser) {
        if (user.isMentor) {
            return Groups.findOne({ where: {id} } );
        }
        if (user.groupId !== id) {
            throw new Unauthorized('You do not have rights to do this.');
        }
        return Groups.findOne({ where: {id} } );
    }
    public async findOneByToken(groupToken: string) {
        const group = await Groups.findOne({ where: { groupToken } });
        if (!group) {
            throw new NotFound('Group not found');
        }
        return group;
    }
    public async updateOne(id: number, data: Groups, user: CustomUser) {
        const mentor = await this.mentorVerification(user);
        const group = await this.isGroupAvailable(id);
        if (group.teacherId !== mentor.id && !mentor.isAdmin) {
            throw new Unauthorized('You do not have rights to do this.');
        }
        if (data.teacherId && !mentor.isAdmin) {
            throw new Unauthorized('You do not have rights to do this.');
        }
        Object.keys(data).forEach((k) => group[k] = data[k]);
        group.save();
        return group;
    }
    public async deleteOne(id: number, user: CustomUser) {
        const mentor = await this.mentorVerification(user);
        const group = await this.isGroupAvailable(id);
        if (group.teacherId !== mentor.id && !mentor.isAdmin) {
            throw new Unauthorized('You do not have rights to do this.');
        }
        group.destroy();
        return group;
    }
    public async findMany(user: CustomUser) {
        if (!user.isMentor) {
            return Groups.findAll({ where: {id: user.groupId} });
        }
        return Groups.findAll();
    }
    private async createGroupToken(name: string): Promise<string> {
        const salt = genSaltSync(5, 'b');
        const hash = hashSync(name, salt);
        return hash.replace(/\//g, 'slash');
    }
    private async mentorVerification(user: CustomUser) {
        const { isMentor } = user;
        if (!isMentor) {
            throw new Unauthorized('You do not have rights to do this.');
        }
        return user;
    }
    private async isGroupAvailable(id: number) {
        const group = await Groups.findOne({ where: {id} });
        if (!group) {
            throw new NotFound(`Group with ${id} not found.`);
        }
        return group;
    }
}

export const groupsService = new GroupsService();
