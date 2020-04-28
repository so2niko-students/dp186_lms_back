import * as Joi from 'joi';

export const updateTeachersDto = Joi.object().keys({
    firstName: Joi.string().min(1),
    lastName: Joi.string().min(1),
    email: Joi.string().email(),
    isAdmin: Joi.boolean(),
    avatar: Joi.object().keys({
        img: Joi.string().base64({paddingRequired: true}).required(),
        format: Joi.string().required(),
    }),
});
