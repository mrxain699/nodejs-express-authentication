const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.APP_MAIL,
    pass: process.env.APP_PASSWORD,
  },
});

async function hash_password(password) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}

async function match_hashed_password(password, hashed_password) {
  const isMatch = await bcrypt.compare(password, hashed_password);
  return isMatch;
}

function generate_jwt_token(user_id, role) {
  const expiresIn = 7 * 24 * 60 * 60;
  const token = jwt.sign(
    {
      user_id: user_id,
      user_role: role,
    },
    process.env.JWT_SECRET,
    { expiresIn: expiresIn }
  );
  return token;
}

function decode_jwt_token(token) {
  const decoded = jwt.decode(token, { complete: true });
  return decoded;
}

function verify_jwt_token(token) {
  const data = jwt.verify(token, process.env.JWT_SECRET);
  return data;
}

async function send_mail(link, rev_address) {
  const info = await transporter.sendMail({
    from: process.env.APP_MAIL,
    to: rev_address,
    subject: "Reset Password Link",
    text: "Here is your reset password Button. Click on the Reset Password button.",
    html: `<a href="${link}" target="_blank">Reset Password</a>`,
  });
  return info.messageId;
}

module.exports = {
  hash_password,
  match_hashed_password,
  generate_jwt_token,
  decode_jwt_token,
  verify_jwt_token,
  send_mail,
};
