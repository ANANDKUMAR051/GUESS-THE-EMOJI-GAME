const mongoose = require("mongoose");
const User = require("../models/User");
const store = require("../store");

const items = [
  { id: "hint", name: "Hint Token", price: 25, currency: "cash", description: "Reveal the first character of an answer.", icon: "💡" },
  { id: "theme", name: "Neon Theme", price: 2, currency: "diamonds", description: "Unlock a neon game theme.", icon: "🌈" },
  { id: "double", name: "Double Reward", price: 50, currency: "cash", description: "A cosmetic reward booster.", icon: "⚡" }
];

exports.items = (req, res) => res.json(items);

exports.buy = async (req, res) => {
  const { userId, itemId } = req.body;
  const item = items.find((i) => i.id === itemId);
  if (!item) return res.status(404).json({ message: "Item not found" });

  if (mongoose.connection.readyState === 1) {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user[item.currency] < item.price) return res.status(400).json({ message: "Not enough currency" });
    user[item.currency] -= item.price;
    await user.save();
    return res.json({ message: `${item.name} purchased`, user: {
      id: user._id, username: user.username, totalScore: user.totalScore,
      highScore: user.highScore, gamesPlayed: user.gamesPlayed, wins: user.wins,
      cash: user.cash, diamonds: user.diamonds, achievements: user.achievements
    }});
  }

  const user = store.getUser(userId);
  if (!user) return res.status(404).json({ message: "User not found" });
  if (user[item.currency] < item.price) return res.status(400).json({ message: "Not enough currency" });
  user[item.currency] -= item.price;
  res.json({ message: `${item.name} purchased`, user: store.publicUser(user) });
};
