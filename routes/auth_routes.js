const express = require("express");
const auth = require("../controllers/AuthController");
const {
  register_middleware,
  authenticate_middleware,
  auhtorized_middleware,
} = require("../middlewares/auth_middlewares");
const router = express.Router();

router
  .route("/auth/register")
  .post(register_middleware, (req, res) => auth.register(req, res));

router
  .route("/auth/login")
  .post(authenticate_middleware, (req, res) => auth.login(req, res));

router
  .route("/auth/change_password")
  .post(auhtorized_middleware, (req, res) => auth.change_password(req, res));

module.exports = router;
