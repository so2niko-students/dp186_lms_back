import { Groups } from './groups.model';
import { Teachers } from '../teachers/teachers.model';
import { Students } from '../students/students.model';
import { NotFound, BadRequest, Unauthorized } from '../../common/exeptions/';
import { hashSync, genSaltSync } from 'bcrypt';

interface IGroupCreate {
    groupName: string;
    teacherId?: number;
    groupToken?: string;
}

class GroupsService {
    public async createOne(data: IGroupCreate, user: any) {
        await this.mentorVerification(user);
        const { groupName } = data;
        const group = await Groups.findAll( { where: {groupName}} );
        if (group.length === 0) {
            data.groupToken = await this.createGroupToken(groupName);
            return Groups.create({...data});
        }
        throw new BadRequest(`Group with name "${groupName} already exist`);
    }
    public async findOne(id: number, user: any) {
        const { email, password } = user;
        const mentor = await Teachers.findOne( { where: { id: user.id, email, password }});
        if (!mentor) {
            const student = await Students.findOne({ where: { id: user.id, email, password }});
            if (student) {
                if (student.groupId === id) {
                    return Groups.findOne({ where: {id} } );
                }
                throw new Unauthorized('You do not have rights to do this.');
            }
            throw new Unauthorized('You do not have rights to do this.');
        }
        return Groups.findOne({ where: {id} } );
    }
    public async updateOne(id: number, data: object, user: any) {
        const mentor = await this.mentorVerification(user);
        const group = await Groups.findOne({ where: {id} });
        if (group) {
            if (group.teacherId === mentor.id) {
                Object.keys(data).forEach((k) => group[k] = data[k]);
                group.save();
                return group;
            }
            throw new Unauthorized('You do not have rights to do this.');
        }
        throw new NotFound(`Group with ${id} not found.`);
    }
    public async deleteOne(id: number, user: any) {
        const mentor = await this.mentorVerification(user);
        const group = await Groups.findOne({ where: {id} });
        if (group) {
            if (group.teacherId === mentor.id) {
                group.destroy();
                return group;
            }
            throw new Unauthorized('You do not have rights to do this.');
        }
        throw new NotFound(`Group with ${id} not found.`);
    }
    public async findMany(user: any) {
        await this.mentorVerification(user);
        return Groups.findAll();
    }

    private async createGroupToken(name: string): Promise<string> {
        const salt = genSaltSync(5, 'b');
        const hash = hashSync(name, salt);
        return hash.replace(/\//g, 'slash');
    }
    private async mentorVerification(user: any): Promise<Teachers> {
        const { id, email, password } = user;
        // Check user in Teachers table
        const mentor = await Teachers.findOne( { where: {id, email, password}});
        if (mentor) {
            return mentor;
        }
        throw new Unauthorized('You do not have rights to do this.');
    }
}

const groupsService = new GroupsService();
export default groupsService;
