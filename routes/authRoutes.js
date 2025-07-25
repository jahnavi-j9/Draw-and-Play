const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/User');

// ------------------
// SIGN UP Route
// ------------------
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  User.getUserByName(username, async (err, existingUser) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    if (existingUser) return res.status(400).json({ message: 'Username already taken' });

    const hashedPassword = await bcrypt.hash(password, 10);
    User.addUser(username, hashedPassword, (err, userId) => {
      if (err) return res.status(500).json({ message: 'Could not create user' });
      res.status(201).json({ success: true, userId });
    });
  });
});

// ------------------
// LOGIN Route ✅ Only ONE
// ------------------
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  User.getUserByName(username, async (err, user) => {
    if (err) return res.status(500).json({ message: 'Server error.' });
    if (!user) return res.status(400).json({ message: 'Invalid username or password.' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid username or password.' });

    return res.json({ success: true, userId: user.id });
  });
});

module.exports = router;
