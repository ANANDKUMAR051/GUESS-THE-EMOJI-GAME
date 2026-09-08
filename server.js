require("dotenv").config();

const path = require("path");
const http = require("http");
const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const connectDB = require("./server/db");

const authRoutes = require("./server/routes/authRoutes");
const gameRoutes = require("./server/routes/gameRoutes");
const leaderboardRoutes = require("./server/routes/leaderboardRoutes");
const achievementRoutes = require("./server/routes/achievementRoutes");
const shopRoutes = require("./server/routes/shopRoutes");
const { registerMultiplayer } = require("./server/multiplayer");

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || true,
    methods: ["GET", "POST"]
  }
});

app.use(cors({ origin: process.env.CLIENT_ORIGIN || true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRoutes);
app.use("/api/game", gameRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/shop", shopRoutes);

app.get("/health", (req, res) => {
  res.json({ ok: true, service: "guess-the-emoji" });
});

app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api/")) {
    return res.sendFile(path.join(__dirname, "public", "index.html"));
  }

  next();
});

registerMultiplayer(io);

const PORT = Number(process.env.PORT) || 5000;

(async () => {
  await connectDB();
  httpServer.listen(PORT, () => {
    console.log(`Guess the Emoji running at http://localhost:${PORT}`);
  });
})();

process.on("SIGINT", async () => {
  await require("mongoose").disconnect();
  process.exit(0);
});
