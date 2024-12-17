const Controller = require("./Controller");
const Auth = require("../models/AuthModel");
const {
  hash_password,
  match_hashed_password,
  generate_jwt_token,
} = require("../utils/HelperFunctions");
const { successResponse, errorResponse } = require("../utils/ResponseHandler");
const { passwordSchema } = require("../utils/Validator");
class AuthController extends Controller {
  constructor() {
    super(Auth);
  }

  async register(req, res) {
    try {
      const hashed_password = await hash_password(req.body.password);
      const data = {
        username: req.body.username,
        email: req.body.email,
        password: hashed_password,
        role: req.body.role,
      };
      const user = await this._add(data);
      if (user) {
        successResponse(res, "User registered successfully", user);
      } else {
        errorResponse(res, "User registration failed", {
          error: "User registration failed",
        });
      }
    } catch (error) {
      errorResponse(res, error.message, { error: error.message });
    }
  }

  async login(req, res) {
    try {
      if (req.user) {
        const token = generate_jwt_token(req.user._id, req.user.role);
        if (token) {
          const user = req.user.toObject();
          delete user.password;
          successResponse(res, "User authenticated successfully", {
            ...user,
            token: token,
          });
        }
      } else {
        errorResponse(res, "Authentication failed", {
          error: "Invalid username or password",
        });
      }
    } catch (error) {
      errorResponse(res, error.message, { error: error.message });
    }
  }

  async change_password(req, res) {
    const { old_password, new_password } = req.body;
    const user = req.user;
    if (user) {
      const isPasswordValid = await match_hashed_password(
        old_password,
        user.password
      );
      if (isPasswordValid) {
        const { error } = passwordSchema.validate(new_password);
        if (error) {
          errorResponse(res, error.message, { error: error.message });
        } else {
          const hashed_password = await hash_password(new_password);
          const updated_user = await this._update(
            { _id: user._id },
            { password: hashed_password }
          );
          if (updated_user) {
            successResponse(res, "Password changed successfully");
          } else {
            errorResponse(res, "Password change failed", {
              error: "Password change failed",
            });
          }
        }
      } else {
        errorResponse(res, "Password Validation Error", {
          error: "Invalid old password",
        });
      }
    }
  }

  async reset_password(req, res) {}
}

module.exports = new AuthController();
