import * as Joi from 'joi';

export const createTaskDto = Joi.object().keys({
  groupId: Joi.number().required(),
  taskName: Joi.string().min(2).required(),
  fileURL: Joi.string().uri(),
  description: Joi.string().min(2)
});

export const updateTaskDto = Joi.object().keys({
  groupId: Joi.number(),
  taskName: Joi.string().min(2),
  fileURL: Joi.string().uri(),
  description: Joi.string().min(2)
});
