import * as Joi from 'joi';

export const updateTeachersDto = Joi.object().keys({
    firstName: Joi.string().min(1),
    lastName: Joi.string().min(1),
    email: Joi.string().email(),
});
