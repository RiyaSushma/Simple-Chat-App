const db = require('../database/db');

// Create or find a chat between two users
exports.createOrFindChat = (req, res) => {
    const { userIds, isGroupChat } = req.body;
    const senderId = req.user.userId;  // Assume `req.user.userId` gives the ID of the sender

    // Fetch the usernames of all users involved, including the sender
    const sqlFetchUsers = 'SELECT id, username FROM Users WHERE id IN (?)';
    db.query(sqlFetchUsers, [userIds], (err, users) => {
        if (err) return res.status(500).json({ message: 'Failed to fetch user data' });

        if (users.length !== userIds.length) {
            return res.status(400).json({ message: 'Invalid user IDs' });
        }

        // Find the sender's username
        const sender = users.find(user => user.id === senderId);
        if (!sender) {
            return res.status(400).json({ message: 'Sender not found in the user list' });
        }

        // Use the sender's name as the chat name
        const chatName = sender.username;

        // Proceed with chat creation or retrieval
        const sqlInsertChat = 'INSERT INTO Chats (chatName, isGroupChat) VALUES (?, ?)';
        db.query(sqlInsertChat, [chatName, isGroupChat], (err, result) => {
            if (err) return res.status(500).json({ message: 'Chat creation failed' });

            const chatId = result.insertId;
            const sqlInsertUserChats = 'INSERT INTO UserChats (userId, chatId) VALUES ?';
            const userChatValues = userIds.map(userId => [userId, chatId]);

            db.query(sqlInsertUserChats, [userChatValues], (err, result) => {
                if (err) return res.status(500).json({ message: 'Failed to link users with chat' });
                res.status(200).json({ chatId });
            });
        });
    });
};


// Get all chats for a user
exports.getUserChats = (req, res) => {
    const userId = req.user.userId;

    const sql = `SELECT Chats.id, Chats.chatName, Chats.isGroupChat 
                 FROM Chats 
                 JOIN UserChats ON Chats.id = UserChats.chatId 
                 WHERE UserChats.userId = ?`;
    db.query(sql, [userId], (err, result) => {
        if (err) return res.status(500).json({ message: 'Failed to retrieve chats' });
        res.json(result);
    });
};
