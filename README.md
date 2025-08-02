
# 🎨 Draw-and-Play

**Draw-and-Play** is a real-time, multiplayer online drawing game inspired by platforms like Drawasaurus and Skribbl.io. Players can create or join rooms, draw a word, and others try to guess what it is — all in a fun, collaborative environment!



## 🚀 Live Demo

📍 **https://wordguessing.onrender.com/**



## 🧠 Tech Stack

### 🔹 Frontend:
- HTML, CSS, JavaScript
- Custom UI built without frameworks
- Responsive design for multiple screen sizes

### 🔹 Backend:
- Node.js with Express
- Socket.IO for real-time communication
- Multer (if file uploads are used)



## 📁 Project Structure

```

assets/
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── signup.html
│   ├── create-room.html
│   ├── join-room.html
│   ├── room.html
│   ├── game.html
│   ├── game.js
│   ├── style.css
│   └── script.js
│
├── backend/
│   ├── index.js
│   ├── server.js
│   ├── socket.js
│   ├── routes/
│   └── controllers/
│
└── .gitignore
└── README.md

````



## ✨ Features

- 🧑‍🤝‍🧑 Multiplayer room creation and joining
- ⏱️ Real-time drawing and guessing via Socket.IO
- 🔐 Login & Signup functionality
- ✍️ Drawing canvas with live updates
- 📊 Scoreboard or timer (if implemented)



## 📦 Getting Started

### 1️⃣ Clone the repo

```bash
git clone https://github.com/jahnavi-j9/Draw-and-Play.git
cd Draw-and-Play/assets
````



### 2️⃣ Install backend dependencies

```bash
cd backend
npm install
```



### 3️⃣ Start the backend server

```bash
node index.js
```



### 4️⃣ Run the frontend
```bash
Simply open `frontend/index.html` or `frontend/login.html` in your browser.
```
## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you’d like to change.










