import * as Joi from 'joi';

export const updateSolutionsDto = Joi.object().keys({
    isCompleted: Joi.number().integer().min(0).max(1),
    grade: Joi.number(),
});
