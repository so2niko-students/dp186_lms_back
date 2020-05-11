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
      const teachers = await teachersService.createOne(req.body, req.user);
      res.json(teachers);
    }
    catch (e) {
      next(e);
    }
  }

  public async deleteOneById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      validateIdOrThrow(+req.params.id);

      const removedTeacherId = await teachersService.deleteOneById(+req.params.id, req.user);
      res.json(removedTeacherId);
    }
    catch (e) {
      next(e);
    }
  }

  public async findAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {  
      const teachers = await teachersService.findAll(+req.query.page, +req.query.limit);
      res.json(teachers);
    }
    catch (e) {
      next(e);
    }
  }

  public async findById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      validateIdOrThrow(+req.params.id);

      const teacher = await teachersService.findOneById(+req.params.id);
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
