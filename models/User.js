const db = require('../db');

// Insert new user into SQLite
function addUser(username, password, callback) {
  const query = `INSERT INTO users (username, password) VALUES (?, ?)`;
  db.run(query, [username, password], function (err) {
    callback(err, this?.lastID);
  });
}

// Get user by username
function getUserByName(username, callback) {
  const query = `SELECT * FROM users WHERE username = ?`;
  db.get(query, [username], callback);
}

module.exports = { addUser, getUserByName };
