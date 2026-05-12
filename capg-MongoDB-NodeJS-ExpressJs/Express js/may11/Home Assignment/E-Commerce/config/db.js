const mongoose = require("mongoose");

const connectDB = () => {
  if (!process.env.MONGODB_URL) {
    console.log("MONGODB_URL environment variable is not set");
    process.exit(1);
  }

  return mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log("Database connection established"))
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });
};

module.exports = connectDB;
