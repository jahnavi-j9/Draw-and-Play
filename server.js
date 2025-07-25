const express = require("express");
const path = require("path");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, "../frontend")));

// Route: Serve base game page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/game.html"));
});

// Auth Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// Room Routes
const roomRoutes = require("./routes/roomRoutes");
app.use("/api/rooms", roomRoutes);

// In-memory maps
const roomPlayers = {}; // { roomId: [{ socketId, userId, email }] }
const roomGameState = {}; // { roomId: { players: [], drawerIdx: 0, word: '', scores: {} } }

// Word list
const WORDS = [
  "apple", "car", "banana", "pizza", "tree", "house", "dog", "star", "laptop", "guitar"
];
const WINNING_SCORE = 5; // Winner threshold

function pickRandomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

// ⚡️ Socket.IO
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // --- Join Room ---
  socket.on("joinRoom", ({ roomId, userId, email }) => {
    socket.join(roomId);
    socket.roomId = roomId;
    socket.userId = userId;
    socket.email = email;

    if (!roomPlayers[roomId]) roomPlayers[roomId] = [];
    if (!roomPlayers[roomId].some(u => u.userId === userId)) {
      roomPlayers[roomId].push({ socketId: socket.id, userId, email });
    }

    console.log(`User ${email} joined Room: ${roomId}`);

    io.to(roomId).emit("updatePlayers", roomPlayers[roomId].map(u => u.email));

    // --- Game State Setup ---
    if (!roomGameState[roomId]) {
      roomGameState[roomId] = {
        players: [],
        drawerIdx: 0,
        word: pickRandomWord(),
        scores: {}
      };
    }

    const gameState = roomGameState[roomId];
    if (!gameState.players.includes(userId)) {
      gameState.players.push(userId);
      gameState.scores[userId] = gameState.scores[userId] || 0;
    }

    const drawerId = gameState.players[gameState.drawerIdx];
    const drawerEmail = roomPlayers[roomId]?.find(u => u.userId === drawerId)?.email;

    // Broadcast game state to all
    io.to(roomId).emit("gameState", {
      drawerId,
      drawerEmail
    });

    // Send word only to drawer
    if (socket.userId === drawerId) {
      socket.emit("drawerWord", gameState.word);
    }

    // Send initial scores
    io.to(roomId).emit("scoreUpdate", gameState.scores);
  });

  // --- Drawing ---
  socket.on("draw", ({ x, y, color, roomId, eraser }) => {
    socket.to(roomId).emit("draw", { x, y, color, eraser });
  });

  // --- Chat Message ---
  socket.on("message", ({ roomId, message }) => {
    const displayName = socket.email || `User ${socket.id}`;
    io.to(roomId).emit("message", `${displayName}: ${message}`);
  });

  // --- Guess Word ---
  socket.on("guess", async ({ roomId, guess }) => {
    const game = roomGameState[roomId];
    const correct = game && guess.trim().toLowerCase() === game.word.toLowerCase();

    if (correct) {
      const guesser = socket.email;
      game.scores[socket.userId] += 1;

      io.to(roomId).emit("guessedCorrect", guesser, game.word);

      // Win check
      if (game.scores[socket.userId] >= WINNING_SCORE) {
        io.to(roomId).emit("gameOver", guesser);
        // Optionally, cleanup game (uncomment line below if you want to auto-reset)
        // delete roomPlayers[roomId]; delete roomGameState[roomId];
        return;
      }

      // Advance turn
      game.drawerIdx = (game.drawerIdx + 1) % game.players.length;
      game.word = pickRandomWord();
      const nextDrawerId = game.players[game.drawerIdx];
      const drawerEmail = roomPlayers[roomId]?.find(u => u.userId === nextDrawerId)?.email;

      // Update game state for everyone
      io.to(roomId).emit("gameState", {
        drawerId: nextDrawerId,
        drawerEmail
      });

      // Update all scores
      io.to(roomId).emit("scoreUpdate", game.scores);

      // Word only sent to drawer
      const sockets = await io.in(roomId).fetchSockets();
      sockets.forEach(s => {
        if (s.userId === nextDrawerId) {
          s.emit("drawerWord", game.word);
        }
      });
    }
  });

  // --- Disconnect ---
  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`);
    const { roomId, userId } = socket;

    if (roomId && userId && roomPlayers[roomId]) {
      roomPlayers[roomId] = roomPlayers[roomId].filter(u => u.userId !== userId);
      io.to(roomId).emit("updatePlayers", roomPlayers[roomId].map(u => u.email));
    }

    // Optional: Cleanup entire game state when room is empty
    if (roomId && roomPlayers[roomId] && roomPlayers[roomId].length === 0) {
      delete roomPlayers[roomId];
      delete roomGameState[roomId];
    }
  });
});

// ✅ Start server
http.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
