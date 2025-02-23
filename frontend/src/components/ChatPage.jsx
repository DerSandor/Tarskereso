import React, { useState } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";

const ChatPage = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);

  return (
    <div className="flex h-screen">
      <ChatSidebar onSelectConversation={setSelectedConversation} />
      <ChatWindow conversationId={selectedConversation} />
    </div>
  );
};

export default ChatPage;
