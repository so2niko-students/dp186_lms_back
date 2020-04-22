import { Groups } from './groups.model';
import { Teachers } from '../teachers/teachers.model';
import { Students } from '../students/students.model';
import { NotFound, BadRequest, Unauthorized } from '../../common/exeptions/';
import { hashSync, genSaltSync } from 'bcrypt';
import {CustomUser} from '../../common/types/types';

interface IGroupCreate {
    groupName: string;
    user: Teachers | Students;
    groupToken?: string;
}

class GroupsService {
    public async createOne(data: IGroupCreate, user: CustomUser) {
        await this.mentorVerification(user);
        const { groupName } = data;
        const group = await Groups.findOne( { where: {groupName, teacherId: data.user.id}} );
        if (group) {
            throw new BadRequest(`Group with name "${groupName} already exist`);
        }
        data.groupToken = await this.createGroupToken(groupName);
        return Groups.create({...data});
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
    public async updateOne(id: number, data: object, user: CustomUser) {
        const mentor = await this.mentorVerification(user);
        const group = await this.isGroupAvailable(id);
        if (group.teacherId !== mentor.id) {
            throw new Unauthorized('You do not have rights to do this.');
        }
        Object.keys(data).forEach((k) => group[k] = data[k]);
        group.save();
        return group;
    }
    public async deleteOne(id: number, user: CustomUser) {
        const mentor = await this.mentorVerification(user);
        const group = await this.isGroupAvailable(id);
        if (group.teacherId !== mentor.id) {
            throw new Unauthorized('You do not have rights to do this.');
        }
        group.destroy();
        return group;
    }
    public async findMany(user: CustomUser) {
        await this.mentorVerification(user);
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
