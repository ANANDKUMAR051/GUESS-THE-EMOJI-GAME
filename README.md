# Guess the Emoji — Full Stack

A clean rebuild of the Guess the Emoji project using HTML5, CSS3, vanilla ES6+ JavaScript, Node.js, Express, Socket.io, MongoDB/Mongoose and bcrypt.

## Features

- Secure signup/login with bcrypt password hashing
- Solo mode: 5 rounds, 3 attempts, 60-second timer, score saving
- Real-time multiplayer matchmaking with Socket.io
- MongoDB/Mongoose persistence when MongoDB is available
- Automatic in-memory fallback for local testing when MongoDB is unavailable
- Global top-10 leaderboard
- Achievements
- In-game shop with cash/diamonds
- Responsive desktop/mobile UI
- API routes separated into controllers/routes/models

## Run

1. Install Node.js 20+.
2. Open a terminal in this folder.
3. Run `npm install`.
4. Copy `.env.example` to `.env`.
5. Start MongoDB if you want persistent database storage.
6. Run `npm start`.
7. Open http://localhost:5000

### MongoDB

Default:
`mongodb://127.0.0.1:27017/guess_the_emoji`

You can change `MONGO_URI` in `.env`.

## API

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me?userId=...`
- `POST /api/game/save`
- `GET /api/leaderboard`
- `GET /api/achievements/:userId`
- `POST /api/achievements/update`
- `GET /api/shop`
- `POST /api/shop/buy`

## Important

The `.env` file is intentionally not included. Use `.env.example` and keep real credentials out of Git.
