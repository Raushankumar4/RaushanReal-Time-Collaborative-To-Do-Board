const mongoose = require("mongoose");
require("dotenv").config();
console.log(process.env.MONGODB_URI);

module.exports = async function connectDB() {
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "ToDoBoard",
    });
    console.log(`DB connected: ${connect.connection.host}`);
  } catch (error) {
    console.log(`Error while Connecting DB${error.m}`);
    process.exit(1);
  }
};
