import React from 'react';
import PropTypes from 'prop-types';

const Message = ({ message }) => {
  const currentUserEmail = sessionStorage.getItem("username");
  
  const isCurrentUserMessage = message.sender_name === currentUserEmail || 
                             message.sender_name === currentUserEmail.split('@')[0] ||
                             (currentUserEmail === 'admin@example.com' && message.sender_name === 'admin');
  
  return (
    <div className="w-full mb-2 sm:mb-4">
      <div 
        className={`flex ${isCurrentUserMessage ? 'justify-end' : 'justify-start'}`}
      >
        <div 
          className={`max-w-[85%] sm:max-w-[70%] rounded-lg p-2 sm:p-3 shadow-md
                     ${isCurrentUserMessage 
                       ? 'bg-fatal-red text-white' 
                       : 'bg-fatal-dark text-white'}`}
        >
          <div className="font-semibold mb-1 text-xs sm:text-sm">
            {message.sender_name}
          </div>
          <p className="break-words whitespace-pre-wrap text-sm sm:text-base">{message.content}</p>
          <div className="text-xs mt-2 flex justify-between items-center">
            <span>
              {new Date(message.created_at).toLocaleString('hu-HU', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
            {isCurrentUserMessage && (
              <span className="material-icons text-sm ml-2">
                {message.is_read ? "done_all" : "done"}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

Message.propTypes = {
  message: PropTypes.shape({
    content: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    sender_name: PropTypes.string.isRequired,
    is_read: PropTypes.bool
  }).isRequired
};

export default Message;