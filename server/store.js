const bcrypt = require("bcrypt");

const users = new Map();

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

async function createUser(username, password) {
  const key = normalize(username);
  if (!key) throw new Error("Username is required");
  if (password.length < 6) throw new Error("Password must be at least 6 characters");
  if (users.has(key)) throw new Error("Username already exists");

  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: `local_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    username: String(username).trim(),
    passwordHash,
    totalScore: 0,
    highScore: 0,
    gamesPlayed: 0,
    wins: 0,
    cash: 0,
    diamonds: 0,
    achievements: []
  };
  users.set(key, user);
  return user;
}

async function verifyUser(username, password) {
  const user = users.get(normalize(username));
  if (!user) return null;
  return (await bcrypt.compare(password, user.passwordHash)) ? user : null;
}

function getUser(id) {
  return [...users.values()].find((u) => u.id === id) || null;
}

function saveGame(userId, score, won = false) {
  const user = getUser(userId);
  if (!user) return null;
  user.totalScore += score;
  user.highScore = Math.max(user.highScore, score);
  user.gamesPlayed += 1;
  if (won) user.wins += 1;
  user.cash += Math.max(0, Math.floor(score / 5));
  user.diamonds += score >= 80 ? 1 : 0;
  return user;
}

function leaderboard() {
  return [...users.values()]
    .sort((a, b) => b.highScore - a.highScore || b.totalScore - a.totalScore)
    .slice(0, 10)
    .map((u, i) => ({
      rank: i + 1,
      username: u.username,
      score: u.highScore,
      totalScore: u.totalScore,
      gamesPlayed: u.gamesPlayed,
      wins: u.wins
    }));
}

function publicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    username: user.username,
    totalScore: user.totalScore,
    highScore: user.highScore,
    gamesPlayed: user.gamesPlayed,
    wins: user.wins,
    cash: user.cash,
    diamonds: user.diamonds,
    achievements: user.achievements
  };
}

module.exports = { createUser, verifyUser, getUser, saveGame, leaderboard, publicUser };
