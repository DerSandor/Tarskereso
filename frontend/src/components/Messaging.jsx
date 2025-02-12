import React, { useState, useEffect, useCallback } from 'react';
import { sendMessage, getMessages, searchUsers } from '../api';
import { toast } from 'react-toastify';

const Messaging = () => {
  const [receiverInput, setReceiverInput] = useState('');
  const [content, setContent] = useState('');
  const [messages, setMessages] = useState([]);
  const token = localStorage.getItem('access_token');

  const getUserIdFromToken = () => {
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.user_id;
  };

  const currentUserId = getUserIdFromToken();

  const loadMessages = useCallback(() => {
    getMessages(token)
      .then(response => setMessages(response.data))
      .catch(() => toast.error('Hiba történt az üzenetek betöltése során.'));
  }, [token]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const findReceiverId = async () => {
    try {
      const response = await searchUsers(token, receiverInput);
      if (response.data.length > 0) {
        return response.data[0].id;  // Már nincs szükség a setReceiverId-re
      } else {
        toast.error('Nem található ilyen felhasználó.');
        return null;
      }
    } catch {
      toast.error('Hiba történt a címzett keresése során.');
      return null;
    }
  };
  

  const handleSend = async (e) => {
    e.preventDefault();

    if (!receiverInput || !content) {
      toast.warn('Kérlek töltsd ki az összes mezőt!');
      return;
    }

    const receiver = await findReceiverId();
    if (!receiver) return;

    sendMessage(token, receiver, content)
      .then(() => {
        toast.success('Üzenet elküldve!');
        setContent('');
        loadMessages();
      })
      .catch(() => {
        toast.error('Hiba történt az üzenet küldése során.');
      });
  };

  return (
    <div style={containerStyle}>
      <h2>Üzenetküldés</h2>
      <form onSubmit={handleSend} style={formStyle}>
        <input
          type="text"
          placeholder="Címzett email vagy felhasználónév"
          value={receiverInput}
          onChange={(e) => setReceiverInput(e.target.value)}
          style={inputStyle}
          required
        />
        <textarea
          placeholder="Írj egy üzenetet..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={textareaStyle}
          required
        />
        <button type="submit" style={buttonStyle}>Küldés</button>
      </form>

      <h3>Üzenetek</h3>
      <div style={messageContainerStyle}>
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg.id}
              style={msg.sender === currentUserId ? sentMessageStyle : receivedMessageStyle}
            >
              <p><strong>{msg.sender === currentUserId ? 'Te' : `Feladó: ${msg.sender}`}</strong></p>
              <p>{msg.content}</p>
              <small>{new Date(msg.timestamp).toLocaleString()}</small>
            </div>
          ))
        ) : (
          <p>Nincsenek üzenetek.</p>
        )}
      </div>
    </div>
  );
};

export default Messaging;

// ---------- Stílusok ----------

const containerStyle = {
  padding: '20px',
  maxWidth: '600px',
  margin: '0 auto',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  marginBottom: '20px',
};

const inputStyle = {
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  fontSize: '16px',
};

const textareaStyle = {
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  fontSize: '16px',
  resize: 'vertical',
  minHeight: '80px',
};

const buttonStyle = {
  padding: '10px',
  borderRadius: '5px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  cursor: 'pointer',
  fontSize: '16px',
};

const messageContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
};

const sentMessageStyle = {
  alignSelf: 'flex-end',
  backgroundColor: '#d1ecf1',
  padding: '10px',
  borderRadius: '10px',
  maxWidth: '70%',
  border: '1px solid #bee5eb',
};

const receivedMessageStyle = {
  alignSelf: 'flex-start',
  backgroundColor: '#f8f9fa',
  padding: '10px',
  borderRadius: '10px',
  maxWidth: '70%',
  border: '1px solid #dee2e6',
};
