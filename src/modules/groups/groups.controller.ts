import { Request, Response, NextFunction} from 'express';
import { Groups } from './groups.model';
import groupsService from './groups.service';

class GroupsController {
    public async createOne(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const group: Groups = await groupsService.createOne(req.body, req.user);
            res.send(group);
        } catch (e) {
            next(e);
        }
    }
    public async findOne(req: Request, res: Response, next: NextFunction) {
        try {
            const group: Groups = await groupsService.findOne(Number(req.params.id), req.user);
            res.send(group);
        } catch (e) {
            next(e);
        }
    }
    public async updateOne(req: Request, res: Response, next: NextFunction) {
        try {
            const group: Groups = await groupsService.updateOne(Number(req.params.id),
                req.body, req.user);
            res.send(group);
        } catch (e) {
            next(e);
        }
    }
    public async deleteOne(req: Request, res: Response, next: NextFunction) {
        try {
            const group: Groups = await groupsService.deleteOne(Number(req.params.id), req.user);
            res.send(group);
        } catch (e) {
            next(e);
        }
    }
    public async findMany(req: Request, res: Response, next: NextFunction) {
        try {
            const groups: Groups[] = await groupsService.findMany(req.user);
            res.send(groups);
        } catch (e) {
            next(e);
        }
    }
}

const groupsController = new GroupsController();
export default groupsController;
