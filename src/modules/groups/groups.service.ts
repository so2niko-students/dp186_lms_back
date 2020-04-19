import { Groups } from './groups.model';
import { Teachers } from '../teachers/teachers.model';
import { NotFound, BadRequest, Unauthorized } from '../../common/exeptions/';
import { hashSync, genSaltSync } from 'bcrypt';

interface IGroupCreate {
    groupName: string;
    teacherId?: number;
    groupToken?: string;
}

class GroupsService {
    public async createOne(data: IGroupCreate, user: any) {
        await this.userVerification(user);
        const { groupName } = data;
        const group = await Groups.findAll( { where: {groupName}} );
        if (group.length === 0) {
            data.groupToken = await this.createGroupToken(groupName);
            return Groups.create({...data});
        }
        throw new BadRequest(`Group with name "${groupName} already exist`);
    }
    public async findOne(id: string, user: any) {
        await this.userVerification(user);
        return Groups.findOne({ where: {id} } );
    }
    public async updateOne(id: string, data: object, user: any) {
        const mentor = await this.userVerification(user);
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
    public async deleteOne(id: string, user: any) {
        const mentor = await this.userVerification(user);
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
        await this.userVerification(user);
        return Groups.findAll();
    }

    private async createGroupToken(name: string): Promise<string> {
        const salt = genSaltSync(5, 'b');
        const hash = hashSync(name, salt);
        return hash.replace(/\//g, 'slash');
    }
    private async userVerification(user: any): Promise<Teachers> {
        const mentor = await Teachers.findOne( { where: {...user}}); // Check user in Teachers table
        if (mentor) {
            return mentor;
        }
        throw new Unauthorized('You do not have rights to do this.');
    }
}

const groupsService = new GroupsService();
export default groupsService;
