const mongoose = require("mongoose");
const User = require("../models/User");
const store = require("../store");

exports.getLeaderboard = async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    const users = await User.find({}, "username highScore totalScore gamesPlayed wins")
      .sort({ highScore: -1, totalScore: -1 }).limit(10).lean();
    return res.json(users.map((u, i) => ({ rank: i + 1, username: u.username, score: u.highScore,
      totalScore: u.totalScore, gamesPlayed: u.gamesPlayed, wins: u.wins })));
  }
  res.json(store.leaderboard());
};
