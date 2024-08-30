const express = require('express');
const path = require('path');
const cors = require('cors');
const authRoutes = require('./routes/authRouter');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const userRouter = require('./routes/userRouter');

const app = express();

app.use(express.json());
app.use(cors());
app.use('/uploads/profile_images', express.static(path.join(__dirname, 'uploads/profile_images')));

app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
