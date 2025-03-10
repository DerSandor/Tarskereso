import React, { useEffect, useState } from "react";
import PropTypes from "prop-types"; // ✅ Csak egyszer importáljuk!
import { getMessages, sendMessage } from "../api";
import Message from "./Message";  // Importáljuk a Message komponenst

const ChatWindow = ({ conversationId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (!conversationId) return;

    const fetchMessages = async () => {
      try {
        const token = sessionStorage.getItem("access_token");
        const response = await getMessages(token, conversationId);
        setMessages(response.data);
      } catch (error) {
        console.error("Hiba az üzenetek betöltésekor:", error);
      }
    };

    fetchMessages();
  }, [conversationId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const token = sessionStorage.getItem("access_token");
      await sendMessage(token, conversationId, newMessage);
      setNewMessage("");

      // Üzenetek frissítése
      const response = await getMessages(token, conversationId);
      setMessages(response.data);
    } catch (error) {
      console.error("Hiba az üzenet küldésekor:", error);
    }
  };

  if (!conversationId) {
    return <div className="w-2/3 p-4">Válassz egy beszélgetést...</div>;
  }

  return (
    <div className="w-2/3 flex flex-col p-4">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <Message
            key={msg.id}
            message={msg}
          />
        ))}
      </div>
      <div className="mt-2 flex">
        <input
          type="text"
          className="border rounded-lg p-2 flex-1"
          placeholder="Írd be az üzeneted..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 bg-fatal-red text-fatal-light p-2 rounded-lg"
        >
          Küldés
        </button>
      </div>
    </div>
  );
};

ChatWindow.propTypes = {
  conversationId: PropTypes.number.isRequired,
};

export default ChatWindow;
