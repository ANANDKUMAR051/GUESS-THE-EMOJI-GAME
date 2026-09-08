const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  passwordHash: { type: String, required: true },
  totalScore: { type: Number, default: 0 },
  highScore: { type: Number, default: 0 },
  gamesPlayed: { type: Number, default: 0 },
  wins: { type: Number, default: 0 },
  cash: { type: Number, default: 0 },
  diamonds: { type: Number, default: 0 },
  achievements: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
