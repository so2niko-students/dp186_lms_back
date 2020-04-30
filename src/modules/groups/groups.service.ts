import { Groups } from './groups.model';
import { NotFound, BadRequest, Forbidden } from '../../common/exeptions/';
import { hashSync, genSaltSync } from 'bcrypt';
import {CustomUser} from '../../common/types/types';
import {teachersService} from '../teachers/teachers.service';
import {Avatars} from '../avatars/avatars.model';

const NO_RIGHTS = 'You do not have rights to do this.';

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
    public async findOneOrThrow(id: number, user: CustomUser) {
        if (user.groupId !== id && !user.isMentor) {
            throw new Forbidden(NO_RIGHTS);
        }
        const group = Groups.findOne({ where: {id} } );
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

  public async updateOne(id: number, data: Groups, user: CustomUser) {
        const mentor = await this.mentorVerification(user);
        const group = await this.findOneOrThrow(id, user);
        if (group.teacherId !== mentor.id && !mentor.isAdmin) {
            throw new Forbidden(NO_RIGHTS);
        }
        if (data.teacherId && !mentor.isAdmin) {
            throw new Forbidden(NO_RIGHTS);
        }
        Object.keys(data).forEach((k) => group[k] = data[k]);
        group.save();
        return group;
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
    public async findMany(mentorId: number, user: CustomUser) {
        if (!user.isMentor) {
            return Groups.findAll({ where: {id: user.groupId} });
        }
        if (mentorId) {
            return Groups.findAll({ where: {teacherId: mentorId} });
        }
        return Groups.findAll();
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
    private async mentorVerification(user: CustomUser) {
        const { isMentor } = user;
        if (!isMentor) {
            throw new Forbidden(NO_RIGHTS);
        }
        return user;
    }
}

export const groupsService = new GroupsService();
