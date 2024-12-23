const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.models.user || mongoose.model("users", UserSchema);
module.exports = User;
