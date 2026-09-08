const mongoose = require("mongoose");
const User = require("../models/User");
const Score = require("../models/Score");
const Game = require("../models/Game");
const store = require("../store");

const dbReady = () => mongoose.connection.readyState === 1;

exports.saveGame = async (req, res) => {
  try {
    const { userId, score = 0, rounds = 0, won = false, mode = "solo" } = req.body;
    if (!userId) return res.status(400).json({ message: "userId is required" });

    if (dbReady()) {
      const user = await User.findByIdAndUpdate(
        userId,
        {
          $inc: {
            totalScore: Number(score),
            gamesPlayed: 1,
            wins: won ? 1 : 0,
            cash: Math.max(0, Math.floor(Number(score) / 5)),
            diamonds: Number(score) >= 80 ? 1 : 0
          },
          $max: { highScore: Number(score) }
        },
        { new: true }
      );
      if (!user) return res.status(404).json({ message: "User not found" });
      await Score.create({ username: user.username, userId: user._id, score: Number(score), mode });
      await Game.create({ userId: user._id, mode, score: Number(score), rounds, won });
      return res.json({ user: {
        id: user._id, username: user.username, totalScore: user.totalScore,
        highScore: user.highScore, gamesPlayed: user.gamesPlayed, wins: user.wins,
        cash: user.cash, diamonds: user.diamonds, achievements: user.achievements
      }});
    }

    const user = store.saveGame(userId, Number(score), won);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user: store.publicUser(user) });
  } catch (error) {
    res.status(500).json({ message: "Could not save game" });
  }
};
