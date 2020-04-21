import { Request, Response, NextFunction} from 'express';
import { Groups as Group } from './groups.model';
import { groupsService } from './groups.service';

class GroupsController {
    public async createOne(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // @ts-ignore
            const group: Group = await groupsService.createOne(req.body, req.user);
            res.send(group);
        } catch (e) {
            next(e);
        }
    }
    public async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // @ts-ignore
            const group: Group = await groupsService.findOne(+req.params.id, req.user);
            res.send(group);
        } catch (e) {
            next(e);
        }
    }
    public async updateOne(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // @ts-ignore
            const group: Group = await groupsService.updateOne(+req.params.id, req.body, req.user);
            res.send(group);
        } catch (e) {
            next(e);
        }
    }
    public async deleteOne(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // @ts-ignore
            const group: Group = await groupsService.deleteOne(+req.params.id, req.user);
            res.send(group);
        } catch (e) {
            next(e);
        }
    }
    public async findMany(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // @ts-ignore
            const groups: Group[] = await groupsService.findMany(req.user);
            res.send(groups);
        } catch (e) {
            next(e);
        }
    }
}

const groupsController = new GroupsController();
export default groupsController;
