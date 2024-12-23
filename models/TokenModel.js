const mongoose = require("mongoose");
const tokenSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "auths",
    },
    token: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Token = mongoose.models.tokens || mongoose.model("tokens", tokenSchema);
module.exports = Token;
