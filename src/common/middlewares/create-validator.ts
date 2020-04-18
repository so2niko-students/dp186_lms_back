import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import BadRequest from '../exeptions/bad-request';

export const createValidator = (schema: Joi, key: string = 'body') =>
    (req: Request, res: Response, next: NextFunction) => {
    const { error } = Joi.validate(req[key], schema);
    if (error) {
        throw new BadRequest(error);
    }
    next();
};
