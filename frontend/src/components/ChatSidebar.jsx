import React, { useEffect, useState } from "react";
import PropTypes from "prop-types"; // ✅ Csak egyszer importáljuk!
import { getConversations } from "../api";

const ChatSidebar = ({ onSelectConversation }) => {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = sessionStorage.getItem("access_token");
        if (!token) {
          console.error("Nincs bejelentkezett felhasználó!");
          return;
        }
        const response = await getConversations(token);
        setConversations(response.data);
      } catch (error) {
        console.error("Hiba a beszélgetések betöltésekor:", error);
      }
    };

    fetchConversations();
  }, []);

  return (
    <div className="w-1/3 bg-gray-100 p-4 border-r border-gray-300 h-screen overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Beszélgetéseim</h2>
      <ul>
        {conversations.map((conv) => (
          <li
            key={conv.id}
            className="p-2 border-b cursor-pointer hover:bg-gray-200"
            onClick={() => onSelectConversation(conv.id)}
          >
            {conv.user1_username} és {conv.user2_username}
          </li>
        ))}
      </ul>
    </div>
  );
};

ChatSidebar.propTypes = {
  onSelectConversation: PropTypes.func.isRequired,
};

export default ChatSidebar;
