import { Groups } from './groups.model';
import { NotFound } from '../../common/exeptions/';
import { hashSync, genSaltSync } from 'bcrypt';
import {where} from "sequelize";
import BadRequest from '../../common/exeptions/bad-request';

interface IGroupCreate {
    groupName: string;
    teacherId?: number;
    groupToken?: string;
}

class GroupsService {
    public async createOne(data: IGroupCreate) {
        const { groupName } = data;
        const group = await Groups.findAll( { where: {groupName}} );
        if (group.length === 0) {
            const salt = genSaltSync(5, 'b');
            const hash = hashSync(data.groupName, salt);
            data.groupToken = hash.replace(/\//g, 'slash');
            return Groups.create({...data});
        }
        throw new BadRequest(`Group with name "${groupName} already exist`);
    }
    public async findOne(id: string) {
        return Groups.findOne({ where: {id} } );
    }
    public async updateOne(id: string, data: object) {
        const group = await Groups.findOne({ where: {id} });
        if (group) {
            Object.keys(data).forEach((k) => group[k] = data[k]);
            group.save();
            return group;
        }
        throw new NotFound(`Group with ${id} not found.`);
    }
    public async deleteOne(id: string) {
        const group = await Groups.findOne({ where: {id} });
        if (group) {
            group.destroy();
            return group;
        }
        throw new NotFound(`Group with ${id} not found.`);
    }
    public async findMany() {
        return Groups.findAll();
    }
}

const groupsService = new GroupsService();
export default groupsService;
