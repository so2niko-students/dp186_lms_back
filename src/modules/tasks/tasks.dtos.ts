import * as Joi from 'joi';

export const createTaskDto = Joi.object().keys({
  groupId: Joi.number().required(),
  taskName: Joi.string().min(2).required(),
  description: Joi.string(),
  fileContent: Joi.string().base64(),
  fileNameExtension: Joi.string()
});

export const updateTaskDto = Joi.object().keys({
  groupId: Joi.number(),
  taskName: Joi.string().min(2),
  description: Joi.string(),
  fileContent: Joi.string().base64(),
  fileNameExtension: Joi.string()
});
