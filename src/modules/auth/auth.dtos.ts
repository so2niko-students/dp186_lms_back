import * as Joi from 'joi';

export const LoginDto: any = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});
