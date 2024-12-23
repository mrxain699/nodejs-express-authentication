const Controller = require("./Controller");
const Auth = require("../models/AuthModel");
const Token = require("../models/TokenModel");
const {
  hash_password,
  match_hashed_password,
  generate_jwt_token,
  send_mail,
} = require("../utils/HelperFunctions");
const { successResponse, errorResponse } = require("../utils/ResponseHandler");
const { userSchema } = require("../utils/Validator");
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
        const passwordSchema = userSchema.extract("password");
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

  async send_reset_pasword_mail(req, res) {
    const { email } = req.body;
    if (email) {
      try {
        const emailSchema = userSchema.extract("email");
        const { error } = emailSchema.validate(email);
        if (error) {
          errorResponse(res, "Field Validation Failed", {
            error: error,
          });
        } else {
          const user = await this._find_by_query({ email: email });
          if (user) {
            const isToken = generate_jwt_token(user._id, user.role);
            if (isToken) {
              const reset_password_url = `http://localhost:${process.env.PORT}/auth/reset_password/${isToken}`;
              const response = await send_mail(reset_password_url, user.email);
              if (response) {
                const token = await new Token({
                  user_id: user._id,
                  token: isToken,
                });
                await token.save();
                successResponse(res, "Reset Password Link Sent Successfully", {
                  reset_password_url: reset_password_url,
                });
              } else {
                errorResponse(res, "Reset Password Link Sending Failed", {
                  error: "Reset Password Link Sending Failed",
                });
              }
            }
          } else {
            errorResponse(res, "Account Not Found", {
              error: "Account not found!",
            });
          }
        }
      } catch (error) {
        errorResponse(res, "Internal Server Error", {
          error: error.message,
        });
      }
    } else {
      errorResponse(res, "Field Validation Failed", {
        error: "Email is required!",
      });
    }
  }
}

module.exports = new AuthController();
