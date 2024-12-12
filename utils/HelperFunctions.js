const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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

module.exports = { hash_password, match_hashed_password, generate_jwt_token };
