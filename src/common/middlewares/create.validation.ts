import * as Joi from 'joi';
import { Schema } from 'joi';
import { Request, Response, NextFunction } from 'express';

export const createValidator = (schema: Schema, key: string = 'body') =>
    (req: Request, res: Response, next: NextFunction) => {
    const { error } = Joi.validate(req[key], schema);
    if (error) {
                 
        return res.send(error);
    }
    next();
};