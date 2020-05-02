import * as Joi from 'joi';

export const createSolutionsDto = Joi.object().keys({
    studentId: Joi.number(),
    taskId: Joi.number(),
    grade: Joi.number(),
});

export const updateSolutionsDto = Joi.object().keys({
    isCompleted: Joi.number(),
    grade: Joi.number(),
});
