const { randomUUID } = require("crypto");

const PUZZLES = [
  { emoji: "🦁👑", answer: "the lion king" },
  { emoji: "🦇🌃", answer: "batman" },
  { emoji: "🚢🧊", answer: "titanic" },
  { emoji: "🕷️🦸", answer: "spiderman" },
  { emoji: "⚡🧙", answer: "harry potter" },
  { emoji: "🦖🌎", answer: "jurassic world" },
  { emoji: "👻🚫", answer: "ghostbusters" },
  { emoji: "🏠🎈", answer: "up" },
  { emoji: "🤖❤️", answer: "wall e" },
  { emoji: "🐠🔎", answer: "finding nemo" }
];

const waiting = [];
const rooms = new Map();

function clean(s) {
  return String(s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function nextPuzzle(room) {
  room.puzzle = PUZZLES[Math.floor(Math.random() * PUZZLES.length)];
  room.round += 1;
}

function registerMultiplayer(io) {
  io.on("connection", (socket) => {
    socket.on("findMatch", ({ username } = {}) => {
      const existing = waiting.shift();
      if (!existing || !io.sockets.sockets.get(existing.socketId)) {
        waiting.push({ socketId: socket.id, username: username || "Player" });
        socket.emit("matchWaiting");
        return;
      }

      const roomId = randomUUID();
      const room = {
        roomId,
        players: [
          { socketId: existing.socketId, username: existing.username || "Player 1", score: 0 },
          { socketId: socket.id, username: username || "Player 2", score: 0 }
        ],
        round: 0,
        maxRounds: 5,
        puzzle: null,
        locked: false
      };
      rooms.set(roomId, room);

      socket.join(roomId);
      io.sockets.sockets.get(existing.socketId).join(roomId);

      nextPuzzle(room);
      io.to(roomId).emit("matchFound", {
        roomId,
        players: room.players.map(p => ({ username: p.username, score: p.score })),
        puzzle: room.puzzle.emoji,
        round: room.round,
        maxRounds: room.maxRounds
      });
    });

    socket.on("submitMultiplayerGuess", ({ roomId, guess } = {}) => {
      const room = rooms.get(roomId);
      if (!room || room.locked) return;

      const player = room.players.find(p => p.socketId === socket.id);
      if (!player) return;

      room.locked = true;
      const correct = clean(guess) === clean(room.puzzle.answer);
      if (correct) player.score += 20;

      io.to(roomId).emit("guessResult", {
        username: player.username,
        correct,
        answer: room.puzzle.answer,
        scores: room.players.map(p => ({ username: p.username, score: p.score }))
      });

      setTimeout(() => {
        if (!rooms.has(roomId)) return;
        if (room.round >= room.maxRounds) {
          const [a, b] = room.players;
          const winner = a.score === b.score ? "Draw" : (a.score > b.score ? a.username : b.username);
          io.to(roomId).emit("multiplayerGameOver", {
            winner,
            scores: room.players.map(p => ({ username: p.username, score: p.score }))
          });
          rooms.delete(roomId);
          return;
        }

        nextPuzzle(room);
        room.locked = false;
        io.to(roomId).emit("nextMultiplayerRound", {
          puzzle: room.puzzle.emoji,
          round: room.round,
          maxRounds: room.maxRounds,
          scores: room.players.map(p => ({ username: p.username, score: p.score }))
        });
      }, 1200);
    });

    socket.on("disconnect", () => {
      for (let i = waiting.length - 1; i >= 0; i--) {
        if (waiting[i].socketId === socket.id) waiting.splice(i, 1);
      }

      for (const [roomId, room] of rooms) {
        if (room.players.some(p => p.socketId === socket.id)) {
          io.to(roomId).emit("opponentLeft");
          rooms.delete(roomId);
        }
      }
    });
  });
}

module.exports = { registerMultiplayer };
