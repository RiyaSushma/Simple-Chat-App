const db = require('../database/db');

// Send a message to a selected user
exports.sendMessage = (req, res) => {
    const { selectedUserId, content, userId } = req.body;
    const senderId = req.body.userId;

    if (!content || content.trim() === '') {
        return res.status(400).json({ message: 'Message content cannot be empty' });
    }

    // Fetch username for the provided userId
    const getUserNameSql = 'SELECT username FROM Users WHERE id = ?';
    db.query(getUserNameSql, [userId], (err, userResult) => {
        if (err) {
            console.error(`Error fetching username: ${err}`);
            return res.status(500).json({ message: 'Failed to fetch username' });
        }

        if (userResult.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userName = userResult[0].username;

        // Check if a chat exists between the sender and the selected user
        const checkChatSql = `
            SELECT Chats.id AS chatId 
            FROM Chats 
            JOIN UserChats AS UC1 ON Chats.id = UC1.chatId 
            JOIN UserChats AS UC2 ON Chats.id = UC2.chatId 
            WHERE UC1.userId = ? AND UC2.userId = ? AND Chats.isGroupChat = FALSE`;

        db.query(checkChatSql, [senderId, selectedUserId], (err, chatResult) => {
            if (err) {
                console.error(`Error checking for existing chat: ${err}`);
                return res.status(500).json({ message: 'Failed to check chat' });
            }

            let chatId;
            if (chatResult.length > 0) {
                // If chat exists, use the existing chatId
                chatId = chatResult[0].chatId;
                insertMessage(chatId, senderId, content, res);
            } else {
                // Create a new chat with the username of the userId
                const createChatSql = 'INSERT INTO Chats (chatName, isGroupChat) VALUES (?, FALSE)';
                db.query(createChatSql, [userName], (err, result) => {
                    if (err) {
                        console.error(`Error creating chat: ${err}`);
                        return res.status(500).json({ message: 'Failed to create chat' });
                    }

                    chatId = result.insertId;

                    // Link users to the new chat
                    const addUserChatSql = 'INSERT INTO UserChats (userId, chatId) VALUES (?, ?), (?, ?)';
                    db.query(addUserChatSql, [senderId, chatId, selectedUserId, chatId], (err) => {
                        if (err) {
                            console.error(`Error linking users to chat: ${err}`);
                            return res.status(500).json({ message: 'Failed to link users to chat' });
                        }

                        // Insert the message
                        insertMessage(chatId, senderId, content, res);
                    });
                });
            }
        });
    });
};

function insertMessage(chatId, senderId, content, res) {
    // SQL query to insert a new message into the Messages table
    const insertMessageSql = `
        INSERT INTO Messages (chatId, senderId, content, createdAt) 
        VALUES (?, ?, ?, NOW())`;

    // Execute the query
    db.query(insertMessageSql, [chatId, senderId, content], (err, result) => {
        if (err) {
            console.error(`Error inserting message: ${err}`);
            return res.status(500).json({ message: 'Failed to insert message' });
        }

        // If needed, you can return the inserted message ID or other details
        console.log(`Message inserted with ID: ${result.insertId}`);
        
        // Respond with a success message
        res.status(200).json({ message: 'Message sent successfully' });
    });
}


exports.getChatMessages = (req, res) => {
    const { chatId } = req.params;

    const sql = `SELECT Messages.id, Messages.content, Messages.createdAt, Users.username 
                 FROM Messages 
                 JOIN Users ON Messages.senderId = Users.id 
                 WHERE Messages.chatId = ? 
                 ORDER BY Users.username, Messages.createdAt ASC`;

    db.query(sql, [chatId], (err, result) => {
        if (err) {
            console.error(`Error retrieving messages: ${err}`);
            return res.status(500).json({ message: 'Failed to retrieve messages' });
        }

        // Group messages by sender username
        const groupedMessages = result.reduce((acc, message) => {
            const { username, content, createdAt } = message;
            if (!acc[username]) {
                acc[username] = [];
            }
            acc[username].push({ content, createdAt });
            return acc;
        }, {});

        res.json(groupedMessages);
    });
};