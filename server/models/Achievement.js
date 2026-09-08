const mongoose = require("mongoose");

const AchievementSchema = new mongoose.Schema({
  key: { type: String, unique: true, required: true },
  name: String,
  description: String,
  icon: String
});

module.exports = mongoose.model("Achievement", AchievementSchema);
