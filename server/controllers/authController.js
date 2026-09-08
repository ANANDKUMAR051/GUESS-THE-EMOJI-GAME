const mongoose = require("mongoose");
const User = require("../models/User");
const store = require("../store");

const dbReady = () => mongoose.connection.readyState === 1;

exports.signup = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    if (dbReady()) {
      // Always store username in lowercase
      const normalizedUsername = username.trim().toLowerCase();

      const exists = await User.findOne({
        username: normalizedUsername,
      });

      if (exists) {
        return res.status(409).json({
          message: "Username already exists",
        });
      }

      const bcrypt = require("bcrypt");
      const passwordHash = await bcrypt.hash(password, 10);

      const user = await User.create({
        username: normalizedUsername,
        passwordHash,
      });

      return res.status(201).json({
        user: {
          id: user._id,
          username: user.username,
          totalScore: 0,
          highScore: 0,
          gamesPlayed: 0,
          wins: 0,
          cash: 0,
          diamonds: 0,
          achievements: [],
        },
      });
    }

    const user = await store.createUser(username, password);

    res.status(201).json({
      user: store.publicUser(user),
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    if (dbReady()) {
      // Convert entered username to lowercase
      const normalizedUsername = username.trim().toLowerCase();

      const user = await User.findOne({
        username: normalizedUsername,
      });

      if (!user) {
        return res.status(401).json({
          message: "Invalid username or password",
        });
      }

      const bcrypt = require("bcrypt");

      const ok = await bcrypt.compare(password, user.passwordHash);

      if (!ok) {
        return res.status(401).json({
          message: "Invalid username or password",
        });
      }

      return res.json({
        user: {
          id: user._id,
          username: user.username,
          totalScore: user.totalScore,
          highScore: user.highScore,
          gamesPlayed: user.gamesPlayed,
          wins: user.wins,
          cash: user.cash,
          diamonds: user.diamonds,
          achievements: user.achievements,
        },
      });
    }

    const user = await store.verifyUser(username, password);

    if (!user) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    res.json({
      user: store.publicUser(user),
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
    });
  }
};

exports.me = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({
      message: "userId is required",
    });
  }

  if (dbReady()) {
    const user = await User.findById(userId).lean();

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.json({
      user: {
        id: user._id,
        username: user.username,
        totalScore: user.totalScore,
        highScore: user.highScore,
        gamesPlayed: user.gamesPlayed,
        wins: user.wins,
        cash: user.cash,
        diamonds: user.diamonds,
        achievements: user.achievements,
      },
    });
  }

  const user = store.getUser(userId);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  res.json({
    user: store.publicUser(user),
  });
};