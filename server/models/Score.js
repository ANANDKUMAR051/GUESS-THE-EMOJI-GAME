const mongoose = require("mongoose");

const ScoreSchema = new mongoose.Schema({
  username: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  score: { type: Number, required: true },
  mode: { type: String, default: "solo" }
}, { timestamps: true });

module.exports = mongoose.model("Score", ScoreSchema);
