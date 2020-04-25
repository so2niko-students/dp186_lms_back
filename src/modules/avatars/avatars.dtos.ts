import * as Joi from 'joi';

export const setAvatarDto = Joi.object().keys({
    img: Joi.string().base64({paddingRequired: true}).required(),
    format: Joi.string().required(),
    groupId: Joi.number(),
});
