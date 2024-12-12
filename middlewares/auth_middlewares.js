const Controller = require("../controllers/Controller");
const Auth = require("../models/AuthModel");
const { userSchema } = require("../utils/Validator");
const { errorResponse } = require("../utils/ResponseHandler");
const { match_hashed_password } = require("../utils/HelperFunctions");
const auth = new Controller(Auth);
const register_middleware = async (req, res, next) => {
  try {
    const { error } = userSchema.validate(req.body);
    const isUserNameExist = await auth._find_by_query({
      username: req.body.username,
    });
    const isEmailExist = await auth._find_by_query({
      email: req.body.email,
    });
    if (error) {
      errorResponse(res, error.message, { error: error.message });
    } else if (isUserNameExist) {
      errorResponse(res, "Username isn't available", {
        error: "Username isn't available",
      });
    } else if (isEmailExist) {
      errorResponse(res, "Email already exist", {
        error: "Email already exist",
      });
    } else {
      next();
    }
  } catch (error) {
    errorResponse(res, error.message, { error: error.message });
  }
};

const authenticate_middleware = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    if (username && password) {
      const user = await auth._find_by_query({
        username: username,
      });
      if (user) {
        const isPasswordValid = await match_hashed_password(
          password,
          user.password
        );
        if (isPasswordValid) {
          req.user = user;
          next();
        } else {
          errorResponse(res, "Invalid username or password", {
            error: "Invalid username or password",
          });
        }
      } else {
        errorResponse(res, "Invalid username or password", {
          error: "Invalid username or password",
        });
      }
    }
  } catch (error) {
    errorResponse(res, error.message, { error: error.message });
  }
};

module.exports = {
  register_middleware,
  authenticate_middleware,
};
