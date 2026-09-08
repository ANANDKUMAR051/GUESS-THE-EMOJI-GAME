const mongoose = require("mongoose");
const User = require("../models/User");
const store = require("../store");

const definitions = [
  ["first_game", "First Steps", "Complete your first game.", "🎯"],
  ["score_50", "Getting Good", "Reach 50 points in one game.", "⭐"],
  ["score_100", "Emoji Master", "Reach 100 points in one game.", "👑"],
  ["five_games", "Regular Player", "Play five games.", "🔥"],
  ["perfect", "Perfect Round", "Finish a game without an incorrect guess.", "💎"]
];

function earnedFor(user, score, perfect) {
  const keys = new Set(user.achievements || []);
  if (user.gamesPlayed >= 1) keys.add("first_game");
  if (score >= 50) keys.add("score_50");
  if (score >= 100) keys.add("score_100");
  if (user.gamesPlayed >= 5) keys.add("five_games");
  if (perfect) keys.add("perfect");
  return [...keys];
}

exports.get = async (req, res) => {
  const userId = req.params.userId;
  if (mongoose.connection.readyState === 1) {
    const user = await User.findById(userId).lean();
    if (!user) return res.status(404).json({ message: "User not found" });
    const unlocked = new Set(user.achievements);
    return res.json(definitions.map(([key, name, description, icon]) => ({
      key, name, description, icon, unlocked: unlocked.has(key)
    })));
  }
  const user = store.getUser(userId);
  if (!user) return res.status(404).json({ message: "User not found" });
  const unlocked = new Set(user.achievements);
  res.json(definitions.map(([key, name, description, icon]) => ({
    key, name, description, icon, unlocked: unlocked.has(key)
  })));
};

exports.update = async (req, res) => {
  const { userId, score = 0, perfect = false } = req.body;
  if (mongoose.connection.readyState === 1) {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.achievements = earnedFor(user, Number(score), perfect);
    await user.save();
    return res.json({ achievements: user.achievements });
  }
  const user = store.getUser(userId);
  if (!user) return res.status(404).json({ message: "User not found" });
  user.achievements = earnedFor(user, Number(score), perfect);
  res.json({ achievements: user.achievements });
};
