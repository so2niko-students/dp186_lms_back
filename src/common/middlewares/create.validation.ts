import * as Joi from 'joi';
import { Schema } from 'joi';
import { Request, Response, NextFunction } from 'express';
import { BadRequest } from  '../exeptions/index';

export const createValidator = (schema: Schema, key: string = 'body') =>
    (req: Request, res: Response, next: NextFunction) => {
    const { error } = Joi.validate(req[key], schema);
    if (error) {
        //throw new BadRequest(error);
           
        return res.send(error);
    }
    next();
};