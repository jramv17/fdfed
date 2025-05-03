import React, { useState, useEffect } from 'react';
import { Avatar, Tooltip } from '@mui/material';
import EmojiPicker from 'emoji-picker-react';
import ScrollToBottom from 'react-scroll-to-bottom';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
function GroupChat({ user, aptId, socket, setIsVideo, isVideo }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [inCall, setIncall] = useState(false);
  const to = 'groupchat';

  useEffect(() => {
    if (socket) {
      // socket.on("incomming:call", () => {
      //   setIncall(!inCall);
      // })

      if (user) {
        socket.on('message-deleted', ({ msgId, replacementMsg }) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg._id === msgId
                ? { ...msg, msg: replacementMsg, deleteForAll: true }
                : msg
            )
          );
        });
      }

      socket.emit('get-grp-chat-history', { to: to, aptId: aptId });
      socket.on('grp-chat-history', (msg) => {
        setMessages(msg);
      });

      socket.on('chat-msgs', (msg) => {
        setMessages((prev) => [...prev, msg]);
      });

      return () => {
        socket.off('chat-history');
        socket.off('chat-msgs');
      };
    }
  }, [user, socket, messages]);

  const currTime = new Date();
  const formatTime = `${currTime
    .getHours()
    .toString()
    .padStart(2, '0')}:${currTime.getMinutes().toString().padStart(2, '0')}`;

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      socket.emit('chat-msgs', {
        userId: user,
        to: to,
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

  const handleCall = () => {
    setIsVideo(!isVideo);
  };

  return (
    <div className="groupchat">
      {/* {inCall ? (<div className="chatname"><h2>group chat</h2><button onClick={handleCall}>answer</button></div>) :
        (<div className="chatname"><h2>group chat</h2><button onClick={handleCall}>📞</button></div>)} */}
      <div className="chatname">
        <div className="avatar-div">
          <Avatar
            src={`https://api.dicebear.com/9.x/initials/svg?seed=Groupchat&radius=10`}
            alt="User Avatar"
            style={{ width: '30px', height: '30px' }}
          />
        </div>
        <div>Group chat</div>
      </div>
      <ScrollToBottom className="msgsdiv">
        <ul id="msgs">
          {messages.map((msg, index) => (
            <div
              className={msg.userId === user ? 'my-msg' : ''}
              style={{ display: 'flex', width: '100%' }}
              key={index}
            >
              <li
                className={msg.userId === user ? 'my-message' : 'other-message'}
              >
                <strong>{msg.userId}</strong>
                <br />
                {msg.msg}
                <br />
                {msg.deleteForAll === false && <div>{msg.time}</div>}
                {msg.userId === user && msg.deleteForAll === false && (
                  // <button onClick={() => handleDelete(msg._id)}>🗑️</button>
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={() => handleDelete(msg._id)}
                  >
                    <DeleteIcon fontSize="inherit" />
                  </IconButton>
                )}
              </li>
              {/* {msg.userId === user && msg.deleteForAll === false && (
              <div className="delete-btn-container">
                <button className="delete-btn" onClick={() => handleDelete(msg._id)}> 🗑️</button>
              </div>
              )} */}
            </div>
          ))}
        </ul>
      </ScrollToBottom>

      <form id="chat-form" onSubmit={handleFormSubmit}>
        <div className="input-div-form">
          <button
            type="button"
            id="emojipicker-btn"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            {showEmojiPicker ? '🫣' : '😊'}
          </button>
        </div>

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
        <div className="input-div-form">
          <input
            type="text"
            id="chat-input"
            autoComplete="off"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <div className="input-div-form">
          <button className="send-button">
            <SendIcon />
          </button>
        </div>
      </form>
    </div>
  );
}

export default GroupChat;
