const db = require('../database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwt_secret = "ThisisJwtSecretCodeforChatSystem";

// Register a new user
exports.register = (req, res) => {
    const { emailId, password, username, role } = req.body;
    const defaultProfileImage = '../uploads/profile_images/default.png';

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.log(err);
        };
        const sql = 'INSERT INTO Users (emailId, password, username, role) VALUES (?, ?, ?, ?)';
        db.query(sql, [emailId, hash, username, role], (err, result) => {
            if (err) return res.status(500).json({ message: `Registration failed: ${err}` });
            res.status(200).json({ message: 'Registration successful' });
        });
    });
};

// Login a user
exports.login = (req, res) => {
    const { emailId, password } = req.body;

    const sql = 'SELECT * FROM Users WHERE emailId = ?';
    db.query(sql, [emailId], (err, result) => {
        if (err) return res.status(500).json({ message: 'Login failed' });
        if (result.length === 0) return res.status(404).json({ message: 'User not found' });

        bcrypt.compare(password, result[0].password, (err, isMatch) => {
            if (err) throw err;

            if (isMatch) {
                const token = jwt.sign({ userId: result[0].id }, jwt_secret, { expiresIn: '24h' });
                res.status(200).json({ token });
            } else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
        });
    });
};


// Logout user
exports.logout = (req, res) => {
    res.status(200).json({ message: 'User logged out successfully' });
};

