import React, { useState, useEffect } from 'react';
import Contentbox from '../components/ContentBox';
import '@fontsource/acme';

import '@fontsource/abril-fatface';
import { Avatar, Tooltip } from '@mui/material';
function Content({ setCurrentChat, socket, user, aptId }) {
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(['groupchat']);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (socket) {
      socket.emit('get-selected-users', { username: user, aptId: aptId });
      socket.on('load-selected-users', (users) => {
        setSelectedUsers(users);
      });

      socket.on('user-list', (users) => {
        setAvailableUsers(users);
      });

      return () => {
        socket.off('load-selected-users');
        socket.off('user-list');
      };
    }
  }, [user, socket]);

  const handleUserSelect = (selectedUser) => {
    if (!selectedUsers.includes(selectedUser)) {
      const updatedUsers = [...selectedUsers, selectedUser];
      setSelectedUsers(updatedUsers);
      socket.emit('save-selected-users', {
        username: user,
        selectedUsers: updatedUsers,
        aptId: aptId,
      });
    }
    setShowDropdown(false);
  };

  const handleChatSelect = (user) => {
    setCurrentChat(user);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // Filter available users based on the search query
  const filteredUsers = availableUsers.filter((availableUser) =>
    availableUser.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="content">
      <div className="contentdiv">
        <div className="userprofiledisplay">
          <div className="avatar-div">
            <Avatar
              src={`https://api.dicebear.com/9.x/initials/svg?seed=${user}&radius=10`}
              alt="User Avatar"
              style={{ width: '30px', height: '30px' }}
            />
          </div>
          <div>{user}</div>
        </div>
        <br />
        <div className="contentbox-container">
          {selectedUsers.map((user, index) => (
            <Contentbox
              key={index}
              name={user}
              onClick={() => handleChatSelect(user)}
            />
          ))}
        </div>
        <div className="add-button-div">
          <button
            className="add-button"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            +
          </button>
        </div>

        {showDropdown && (
          <div className="dropdown">
            <input
              type="text"
              className="search-input"
              placeholder="Search users..."
              value={searchQuery}
              onChange={handleSearch}
            />
            <div className="dropdown-items">
              {filteredUsers.map((user, index) => (
                <div
                  key={index}
                  className="dropdown-item"
                  onClick={() => handleUserSelect(user)}
                >
                  {user}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Content;
