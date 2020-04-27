import * as Joi from 'joi';

export const createGroupDto = Joi.object().keys({
    groupName: Joi.string().min(2).required(),
    teacherId: Joi.number(),
});

export const updateGroupDto = Joi.object().keys({
    groupName: Joi.string().min(2),
    groupToken: Joi.string().min(5),
    teacherId: Joi.number(),
});
