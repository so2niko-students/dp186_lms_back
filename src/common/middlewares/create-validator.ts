import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import BadRequest from '../exeptions/bad-request';

export const createValidator = (schema: Joi.Schema, key: string = 'body') =>
    (req: Request, res: Response, next: NextFunction) => {
    const { error } = Joi.validate(req[key], schema);
    if (error) {
        throw new BadRequest(error);
    }
    next();
};
