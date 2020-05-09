import * as Joi from 'joi';

export const createCommentDto = Joi.object().keys({
    solutionId: Joi.number().required(),
    studentId: Joi.number(),
    teacherId: Joi.number(),
    text: Joi.string().min(1),
    fileLink: Joi.string().base64(),
    fileNameExtension: Joi.string()
});
