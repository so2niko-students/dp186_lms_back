import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../common/types/types';
import { teachersService } from './teachers.service';
import { Teachers } from './teachers.model';
import { UpdateRequest } from '../../common/types/types';
import { validateIdOrThrow } from '../../common/validators/';


import { CustomUser } from '../../common/types/types';

class TeachersController {

  public async createOne(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = req.body;
      const user: CustomUser = req.user;

      const teachers = await teachersService.createOne(body, user);
      res.json(teachers);
    }
    catch (e) {
      next(e);
    }
  }

  public async deleteOneById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      validateIdOrThrow(+req.params.id);

      const id: number = +req.params.id;
      const user: CustomUser = req.user;

      const removedTeacherId = await teachersService.deleteOneById(id, user);
      res.json(removedTeacherId);
    }
    catch (e) {
      next(e);
    }
  }

  public async findAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page: number = +req.query.page;
      const limit: number = +req.query.limit;
    
      const teachers = await teachersService.findAll(page, limit);
      res.json(teachers);
    }
    catch (e) {
      next(e);
    }
  }

  public async findById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      validateIdOrThrow(+req.params.id);

      const id: number = +req.params.id;

      const teacher = await teachersService.findOneById(id);
      res.json(teacher);
    }
    catch (e) {
      next(e);
    }
  }

  public async updateOne(req: UpdateRequest<Teachers>, res: Response,
                         next: NextFunction): Promise<void> {
        try {
            validateIdOrThrow(+req.params.id);
            const teacher =
                await teachersService.updateOneOrThrow(+req.params.id, req.body, req.user);
            res.json(teacher);
        } catch (e) {
            next(e);
        }
    }
}

export const teachersController = new TeachersController();
