import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ChatWindow({ userId, role }) {
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchAvailableUsers = async () => {
      if (!userId || !role) return;

      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          'http://localhost:5000/api/users/available-users',
          { userId, role }, 
          {
            headers: { Authorization: `Bearer ${token}` }, 
          }
        );
        setAvailableUsers(response.data);
      } catch (error) {
        console.error('Error fetching available users:', error);
      }
    };

    fetchAvailableUsers();
  }, [userId, role]);

  const handleSend = async () => {
    if (!selectedUser) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/messages/messages',
        { chatId: selectedUser, content: message, userId: userId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const response = await axios.get(`http://localhost:5000/api/messages/messages/${selectedUser}`, {
        headers: { Authorization: `Bearer ${token}` }, 
      });
      setMessages(response.data);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Chat Window</h2>
      <select 
        onChange={(e) => setSelectedUser(e.target.value)} 
        value={selectedUser} 
        className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select a User</option>
        {availableUsers.map(user => (
          <option key={user.id} value={user.id}>
            {user.username} ({user.role})
          </option>
        ))}
      </select>

      {selectedUser && (
        <div className="flex flex-col h-[400px] bg-white border border-gray-300 rounded-lg overflow-hidden">
          <div className="flex-1 p-4 overflow-auto border-b border-gray-300">
            {messages.map((msg, index) => (
              <p key={index} className="mb-2 p-2 bg-gray-200 rounded-md">{msg.message}</p>
            ))}
          </div>
          <div className="p-4 bg-gray-50 border-t border-gray-300 flex items-center">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              onClick={handleSend} 
              className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatWindow;
