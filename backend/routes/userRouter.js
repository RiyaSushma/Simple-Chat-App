const express = require('express');
const router = express.Router();
const app = express();
const db = require('../database/db');
const bcrypt = require('bcrypt');
const authenticateToken = require('../middleware/authenticateToken');


router.post('/available-users', authenticateToken, (req, res) => {
    const { userId, role } = req.body;
    console.log('Request Body:', { userId, role });

    if (!userId || !role) {
        return res.status(400).json({ message: 'User ID and role are required' });
    }

    let sql;
    let values;

    if (role === 'student') {
        sql = 'SELECT id, username, role FROM Users WHERE id != ? AND role IN (?, ?)';
        values = [userId, 'student', 'teacher'];
    } else if (role === 'teacher') {
        sql = 'SELECT id, username, role FROM Users WHERE id != ?';
        values = [userId];
    } else if (role === 'institute') {
        sql = 'SELECT id, username, role FROM Users WHERE id != ?';
        values = [userId];
    } else {
        return res.status(400).json({ message: 'Invalid role' });
    }

    console.log('SQL Query:', sql);
    console.log('SQL Values:', values);

    db.query(sql, values, (err, results) => {
        if (err) {
            console.error('Database Error:', err);
            return res.status(500).json({ message: 'Error fetching available users' });
        }
        console.log('Results:', results);
        if (results.length === 0) {
            return res.status(404).json({ message: 'No users found matching criteria' });
        }
        res.status(200).json(results);
    });
});


// Create User
router.post('/', authenticateToken, (req, res) => {
  const { username, emailId, password, role } = req.body;
  const sql = 'INSERT INTO Users (username, emailId, password, role) VALUES (?, ?, ?, ?)';
  db.query(sql, [username, emailId, password, role], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error creating user' });
    res.status(201).json({ message: 'User created', userId: result.insertId });
  });
});

// Read Users
router.get('/', authenticateToken, (req, res) => {
  const sql = 'SELECT * FROM Users';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching users' });
    res.status(200).json(results);
  });
});

// Read User by ID
router.get('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM Users WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching user' });
    if (results.length === 0) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(results[0]);
  });
});

// Update User
router.put('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { username, emailId, password, role } = req.body;

    // Initialize an array to store fields that need to be updated
    const fieldsToUpdate = [];
    const values = [];

    // Check which fields are provided in the request body and add them to the update query
    if (username) {
        fieldsToUpdate.push('username = ?');
        values.push(username);
    }
    if (emailId) {
        fieldsToUpdate.push('emailId = ?');
        values.push(emailId);
    }

    if (password) {
        // If password is provided, hash it before updating
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                return res.status(500).json({ message: 'Error hashing password' });
            }
            fieldsToUpdate.push('password = ?');
            values.push(hash);
            // After hashing the password, execute the update query
            executeUpdate();
        });
    } else {
        // If no password update is needed, execute the update query directly
        executeUpdate();
    }

    function executeUpdate() {
        if (role) {
            fieldsToUpdate.push('role = ?');
            values.push(role);
        }

        // If there are no fields to update, return an error
        if (fieldsToUpdate.length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        // Construct the SQL query dynamically based on the fields to update
        const sql = `UPDATE Users SET ${fieldsToUpdate.join(', ')} WHERE id = ?`;
        values.push(id);

        // Execute the query
        db.query(sql, values, (err, result) => {
            if (err) return res.status(500).json({ message: 'Error updating user' });
            if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
            res.status(200).json({ message: 'User updated successfully' });
        });
    }
});
  
// Delete User
router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM Users WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error deleting user' });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted' });
  });
});

module.exports = router;
