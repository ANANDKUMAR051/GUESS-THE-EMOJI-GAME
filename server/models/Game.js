const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  mode: { type: String, enum: ["solo", "multiplayer"], default: "solo" },
  score: { type: Number, default: 0 },
  rounds: { type: Number, default: 0 },
  won: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Game", GameSchema);
