const mongoose = require("mongoose");

const connect = async (DATABASE_URI) => {
  try {
    const response = await mongoose.connect(DATABASE_URI);
    if (response != null) {
      console.log("Database Connected");
    }
  } catch (error) {
    console.log("Database Connection Error", error);
  }
};

module.exports = connect;
