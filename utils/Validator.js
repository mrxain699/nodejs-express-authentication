const Joi = require("joi");

const userSchema = Joi.object({
  username: Joi.string().alphanum().max(10).required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  password: Joi.string().min(8).max(16).required(),
  role: Joi.string().valid("admin", "user").required(),
});

module.exports = {
  userSchema,
};
