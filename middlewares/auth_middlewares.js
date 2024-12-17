const Controller = require("../controllers/Controller");
const Auth = require("../models/AuthModel");
const { userSchema } = require("../utils/Validator");
const { errorResponse } = require("../utils/ResponseHandler");
const {
  match_hashed_password,
  decode_jwt_token,
  verify_jwt_token,
} = require("../utils/HelperFunctions");
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

const auhtorized_middleware = async (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith("Bearer")) {
    try {
      let token = authorization.split(" ")[1];
      const decodedToken = decode_jwt_token(token);
      if (decodedToken && decodedToken.payload.exp * 1000 < Date.now()) {
        errorResponse(res, "Authorization Error", {
          error: "Session has been expired",
        });
      }
      const { user_id, user_role } = verify_jwt_token(token);
      req.user = await auth._find_by_query({ _id: user_id });
      if (req.user) {
        next();
      } else {
        errorResponse(res, "Authorization Error", {
          error: "Your are not authorized to access this resource",
        });
      }
    } catch (error) {
      errorResponse(res, "Internal Server Error", {
        error: error.message,
      });
    }
  } else {
    errorResponse(res, "Authorization Error", {
      error: "Authorization header missing or invalid",
    });
  }
};

module.exports = {
  register_middleware,
  authenticate_middleware,
  auhtorized_middleware,
};
