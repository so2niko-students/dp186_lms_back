import { Response, NextFunction} from 'express';
import { Groups as Group } from './groups.model';
import { groupsService } from './groups.service';
import {AuthRequest} from '../../common/types/types';
import {validateIdOrThrow} from '../../common/validators/';


class GroupsController {
    public async createOne(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const group: Group = await groupsService.createOne(req.body, req.user);
            res.statusCode = 201;
            res.send(group);
        } catch (e) {
            next(e);
        }
    }
    public async findOne(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            validateIdOrThrow(+req.params.id);
            const group: Group = await groupsService.findOneOrThrow(+req.params.id, req.user);
            res.send(group);
        } catch (e) {
            next(e);
        }
    }
    public async updateOne(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            validateIdOrThrow(+req.params.id);
            const group: Group = await groupsService.updateOneOrThrow(+req.params.id, req.body, req.user);
            res.send(group);
        } catch (e) {
            next(e);
        }
    }
    public async deleteOne(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            validateIdOrThrow(+req.params.id);
            const group: Group = await groupsService.deleteOne(+req.params.id, req.user);
            res.send(group);
        } catch (e) {
            next(e);
        }
    }
    public async findMany(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const groups: Group[] = await groupsService.findMany(req.user);
            res.send(groups);
        } catch (e) {
            next(e);
        }
    }
}

const groupsController = new GroupsController();
export default groupsController;
