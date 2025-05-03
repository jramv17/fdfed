import React, { useState, useEffect } from 'react';
import GroupChat from '../components/GroupChat';
import Content from '../components/Content';
import PrivateChat from '../components/PrivateChat';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

function ChatPage() {
  const [currentChat, setCurrentChat] = useState('groupchat');
  const [socket, setSocket] = useState(null);
  const [isVideo, setIsVideo] = useState(false);
  const [remoteSocketId, setRemoteSocketId] = useState(null);

  const room = 1;

  let { apartment_id } = useParams();
  const aptId = apartment_id;

  const { apartment_username } = useSelector((state) => state.user);
  const username = apartment_username;

  useEffect(() => {
    const newsocket = io('http://localhost:5000');
    setSocket(newsocket);

    // newsocket.on('disconnect',)
    return () => {
      newsocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit('identify', { username: username, aptId: apartment_id });
      // socket.emit("room:join", { username: username, aptId: apartment_id, room: room });
      // socket.on("user:joined", ({ username, aptId, socketId }) => {
      //   console.log("user joined ", username, " from ", aptId, " with socketID ", socketId);
      //   setRemoteSocketId(socketId)

      // })
    }
  }, [username, socket]);

  return (
    <>
      <div className="chatPage">
        <>
          <Content
            setCurrentChat={setCurrentChat}
            currentChat={currentChat}
            socket={socket}
            user={username}
            aptId={aptId}
          />

          {currentChat === 'groupchat' ? (
            <GroupChat
              user={username}
              aptId={aptId}
              socket={socket}
              isVideo={isVideo}
              setIsVideo={setIsVideo}
            />
          ) : (
            <PrivateChat
              username={currentChat}
              currentUser={username}
              aptId={aptId}
              socket={socket}
            />
          )}
        </>
      </div>
    </>
  );
}

export default ChatPage;
