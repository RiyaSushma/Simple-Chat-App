import React from 'react';
import ChatList from '../components/chat/ChatList';
import ChatWindow from '../components/chat/ChatWindow';
import { useLocation } from 'react-router-dom';

function Chat() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get('userId');
  const role = queryParams.get('role');
  console.log(userId, role);
  return (
    <div>
      <ChatList userId={userId} role={role} />
      <ChatWindow userId={userId} role={role} />
    </div>
  );
}

export default Chat;
