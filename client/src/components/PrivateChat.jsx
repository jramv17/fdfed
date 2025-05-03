import React, { useEffect, useState } from 'react';
import { Avatar, Tooltip } from '@mui/material';
import EmojiPicker from 'emoji-picker-react';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ScrollToBottom from 'react-scroll-to-bottom';
function PrivateChat({ username, currentUser, aptId, socket }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // useEffect(() => {
  //   socket.emit('identify', {username:currentUser,aptId:aptId});

  // }, [currentUser])

  useEffect(() => {
    if (socket) {
      if (username) {
        socket.on('message-deleted', ({ msgId, replacementMsg }) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg._id === msgId
                ? { ...msg, msg: replacementMsg, deleteForAll: true }
                : msg
            )
          );
        });

        socket.emit('get-priv-chat-history', {
          from: currentUser,
          to: username,
          aptId: aptId,
        });

        socket.on('priv-chat-history', (msg) => {
          setMessages(msg);
        });

        socket.on('priv-chat-msgs', (msg) => {
          setMessages((prev) => [...prev, msg]);
        });
        return () => {
          socket.off('priv-chat-history');
          socket.off('priv-chat-msgs');
        };
      }
    }
  }, [username, currentUser, socket, messages]);

  const currTime = new Date();
  const formatTime = `${currTime
    .getHours()
    .toString()
    .padStart(2, '0')}:${currTime.getMinutes().toString().padStart(2, '0')}`;

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      socket.emit('priv-chat-msgs', {
        userId: currentUser,
        to: username,
        msg: input,
        aptId: aptId,
        time: formatTime,
      });
      setInput('');
    }
  };
  const onEmojiClick = (emojiObject) => {
    setInput((prev) => prev + emojiObject.emoji);
  };

  const handleDelete = (msgId) => {
    socket.emit('handle-delete-msgs', { msgId });
  };

  return (
    <div className="groupchat">
      <div className="chatname">
        <div className="avatar-div">
          <Avatar
            src={`https://api.dicebear.com/9.x/initials/svg?seed=${username}&radius=10`}
            alt="User Avatar"
            style={{ width: '30px', height: '30px' }}
          />
        </div>
        <div>{username}</div>
      </div>
      <ScrollToBottom className="msgsdiv">
        <ul id="msgs">
          {messages.map((msg, index) => (
            <div
              className={msg.userId === currentUser ? 'my-msg' : ''}
              style={{ display: 'flex', width: '100%' }}
              key={index}
            >
              <li
                className={
                  msg.userId === currentUser ? 'my-message' : 'other-message'
                }
              >
                <strong>{msg.userId}</strong>
                <br />
                {msg.msg}
                <br />
                {msg.deleteForAll === false && <div>{msg.time}</div>}
                {msg.userId === currentUser && msg.deleteForAll === false && (
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={() => handleDelete(msg._id)}
                  >
                    <DeleteIcon fontSize="inherit" />
                  </IconButton>
                )}
              </li>
            </div>
          ))}
        </ul>
      </ScrollToBottom>

      <form id="chat-form" onSubmit={handleFormSubmit}>
        <button
          type="button"
          id="emojipicker-btn"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          {showEmojiPicker ? '🫣' : '😊'}
        </button>

        {showEmojiPicker && (
          <div id="emojishow-div">
            <div id="emojiclose-div">
              <button
                id="emojiclose-btn"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                x
              </button>
            </div>
            <EmojiPicker
              width={'500px'}
              onEmojiClick={(emojiObject) => onEmojiClick(emojiObject)}
            />
          </div>
        )}

        <input
          type="text"
          id="chat-input"
          autoComplete="off"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="send-button">send</button>
      </form>
    </div>
  );
}

export default PrivateChat;
