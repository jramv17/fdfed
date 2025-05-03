import React from 'react';
import { Avatar } from '@mui/material';
function ContentBox(props) {
  return (
    <div>
      <div className="contentbox-div" onClick={props.onClick}>
        <div className="avatar-div">
          <Avatar
            src={`https://api.dicebear.com/9.x/initials/svg?seed=${props.name}&radius=10`}
            alt="User Avatar"
            style={{ width: '30px', height: '30px' }}
          />
        </div>

        <div className="name-div">{props.name}</div>
      </div>
    </div>
  );
}

export default ContentBox;
