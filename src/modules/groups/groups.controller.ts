import { Response, NextFunction} from 'express';
import { Groups as Group } from './groups.model';
import { groupsService } from './groups.service';
import {AuthRequest} from '../../common/types/types';
import {BadRequest} from '../../common/exeptions';

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
            this.checkIsNumber(req.params.id);
            const group: Group = await groupsService.findOne(+req.params.id, req.user);
            res.send(group);
        } catch (e) {
            next(e);
        }
    }
    public async updateOne(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            this.checkIsNumber(req.params.id);
            const group: Group = await groupsService.updateOne(+req.params.id, req.body, req.user);
            res.send(group);
        } catch (e) {
            next(e);
        }
    }
    public async deleteOne(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            this.checkIsNumber(req.params.id);
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
    private checkIsNumber(num: any): void {
        if (isNaN(+num)) {
           throw new BadRequest('Incorrect group ID');
        }
    }
}

const groupsController = new GroupsController();
export default groupsController;
