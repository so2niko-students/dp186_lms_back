import * as Joi from 'joi';

export const CreateStudentsDto = Joi.object().keys({
  firstNameUkr: Joi.string().min(1).required(),
  lastNameUkr: Joi.string().min(1).required(),
  firstNameEng: Joi.string().min(1).required(),
  lastNameEng: Joi.string().min(1).required(),
  password: Joi.string().min(6).required(),
  passwordConfirmation: Joi.any().valid(Joi.ref('password')).required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.number().integer().required(),
  groupToken: Joi.string().min(1).required(),
});
