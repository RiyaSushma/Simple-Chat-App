import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ChatList({ userId, role }) {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch chats
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/chats/chats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChats(response.data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    fetchChats();
  }, []);

  // Fetch messages when a chat is selected
  useEffect(() => {
    if (selectedChat) {
      const fetchMessages = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://localhost:5000/api/messages/messages/${selectedChat}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          console.log('Messages response:', response.data); // Debug the response

          // Ensure the response data is an object with an array
          if (Array.isArray(response.data.sky)) {
            const organizedMessages = {};
            response.data.sky.forEach((message) => {
              const sender = message.senderName || 'Unknown'; // Adjust according to your data structure
              if (!organizedMessages[sender]) {
                organizedMessages[sender] = [];
              }
              organizedMessages[sender].push({
                content: message.content,
                createdAt: new Date(message.createdAt),
              });
            });

            setMessages(organizedMessages);
          } else {
            console.warn('Expected an array for messages, but got:', response.data.sky);
          }
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };

      fetchMessages();
    }
  }, [selectedChat]);

  const handleChatClick = (chatId) => {
    setSelectedChat(chatId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedChat(null);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Your Chats</h2>
      <ul className="space-y-2">
        {chats.map((chat) => (
          <li
            key={chat.id}
            className="p-4 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition"
            onClick={() => handleChatClick(chat.id)}
          >
            {chat.chatName}
          </li>
        ))}
      </ul>

      {isModalOpen && selectedChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Messages</h3>
              <button
                className="text-gray-500 hover:text-gray-700 transition"
                onClick={closeModal}
              >
                &times;
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th colSpan="2" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Messages
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(messages).map(([sender, msgs]) => (
                    <React.Fragment key={sender}>
                      <tr>
                        <td colSpan="2" className="px-6 py-3 bg-gray-200 font-semibold">
                          {sender}
                        </td>
                      </tr>
                      {Array.isArray(msgs) ? (
                        msgs.map((message, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 text-gray-900">{message.content}</td>
                            <td className="px-6 py-4 text-gray-500 text-right">
                              {message.createdAt.toLocaleString()}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="2" className="px-6 py-4 text-gray-500">No messages available</td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              className="mt-4 bg-blue-500 text-white p-2 rounded-lg w-full hover:bg-blue-600 transition"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatList;
