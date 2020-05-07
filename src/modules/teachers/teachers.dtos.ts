import * as Joi from 'joi';

export const createTeachersDto = Joi.object().keys({
  firstName: Joi.string().min(1).required(),
  lastName: Joi.string().min(1).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const updateTeachersDto = Joi.object().keys({
    firstName: Joi.string().min(1),
    lastName: Joi.string().min(1),
    email: Joi.string().email(),
    avatar: Joi.object().keys({
        img: Joi.string().base64({paddingRequired: true}).required(),
        format: Joi.string().required(),
    }),
});
