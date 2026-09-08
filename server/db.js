const mongoose = require("mongoose");

let connected = false;

async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.log("MONGO_URI not set. Running with in-memory data.");
    return;
  }

  try {
    await mongoose.connect(uri);

    connected = true;

    console.log("MongoDB connected");
  } catch (error) {
    console.warn("MongoDB unavailable. Running with in-memory data.");
    console.error("MongoDB error:", error.message);
  }
}

function isDatabaseConnected() {
  return connected;
}

module.exports = connectDB;
module.exports.isDatabaseConnected = isDatabaseConnected;