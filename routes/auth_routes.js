const express = require("express");
const auth = require("../controllers/AuthController");
const {
  register_middleware,
  authenticate_middleware,
} = require("../middlewares/auth_middlewares");
const router = express.Router();

router
  .route("/auth/register")
  .post(register_middleware, (req, res) => auth.register(req, res));

router
  .route("/auth/login")
  .post(authenticate_middleware, (req, res) => auth.login(req, res));

module.exports = router;
