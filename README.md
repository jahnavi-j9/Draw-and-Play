
# 🎨 Draw and Play - Backend

This is the backend server for the **Draw and Play** online multiplayer word-guessing drawing game. It is built using **Node.js**, **Express**, **Socket.io**, and **SQLite** for lightweight real-time communication and persistent data storage.



## 🚀 Features

- Real-time communication using WebSockets (`socket.io`)
- Room creation and joining functionality
- SQLite database integration for persistent data (users, rooms, scores, etc.)
- CORS-enabled to connect with frontend
- UUID-based unique identifiers
- Secure password storage using `bcrypt` (if user auth is implemented)



## 🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **Socket.io**
- **SQLite**
- **UUID**
- **bcrypt**
- **CORS**



## 📁 Project Structure

```

backend/
├── server.js             # Main server file
├── package.json          # NPM project file
├── package-lock.json
├── node\_modules/
├── game.db               # SQLite DB file (auto-generated or seeded)
└── README.md             # Project documentation

````



## 📦 Installation

```bash
# Step into backend directory
cd path/to/wordguessing/assets/backend

# Install dependencies
npm install
````



## ▶️ Running the Server

```bash
node server.js
```

You should see:

```
Server running at http://localhost:3000
Connected to SQLite database.
```

> Make sure your frontend is also configured to send requests or connect via `socket.io` to `localhost:3000`.


## 🔌 API / Socket Overview

### REST API (Example)

* `POST /create-room` - Create a new game room
* `POST /join-room` - Join an existing room
* `GET /rooms` - Get list of public rooms

### Socket Events (Example)

* `connect` / `disconnect`
* `joinRoom`
* `startGame`
* `drawData`
* `guessWord`
* `endTurn`

> *(Add more details based on your actual implementation)*


## 🧪 Testing

You can test the backend using:

* Postman / Thunder Client
* Frontend pages (e.g. `play.html`)
* Developer tools → Console and Network tab


