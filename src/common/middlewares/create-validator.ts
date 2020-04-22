import * as Joi from "joi";

const createValidator = (schema, key = "body") => (req, res, next) => {
  const { error } = Joi.validate(req[key], schema);

  if (error) {
    return res.send(error);
  }

  next();
};

export { createValidator };
