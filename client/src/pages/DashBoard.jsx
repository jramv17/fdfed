import React, { useState } from 'react';
import { Button, Tooltip } from 'antd';
import { TbHomeShare } from 'react-icons/tb';
import { Link } from 'react-router-dom';
import { UserDash, UserDetails } from '../components/UserDash';
import { useLocation } from 'react-router-dom';

import OwnerVerify from '../components/OwnerVerify';
import { SecurityTabs } from '../components/rsuiteUI/UserDetailsTabs';
function DashBoard() {
  const location = useLocation();
  const [Role, setRole] = useState('Resident');

  return (
    <div className="w-full flex flex-col items-center justify-start relative mt-5 gap-8">
      <div className="form-item flex w-[20vw] mt-5 items-center justify-center gap-3">
        <label className="form-label !text-2xl w-full text-center">
          View as
        </label>
        <select
          id="role"
          defaultValue={'Resident'}
          className="w-full p-2 rounded-md text-center bg-background text-muted-foreground"
          onChange={(e) => setRole(e.target.value)}
        >
          <option
            value="Resident"
            className="bg-background text-muted-foreground"
          >
            Resident
          </option>
          <option value="Owner" className="bg-background text-muted-foreground">
            Owner
          </option>
          <option
            value="Security"
            className="bg-background text-muted-foreground"
          >
            Security
          </option>
        </select>
      </div>{' '}
      {/* Sidebar */}
      {/* <DashBoardSideDash /> */}
      {/* Floating Go Back Button */}
      <Link to={'/'}>
        <span className="fixed  z-50 bottom-8 right-5">
          <Tooltip title="Go back to Homepage">
            <Button
              type="primary"
              shape="circle"
              icon={<TbHomeShare size={20} />}
            />
          </Tooltip>
        </span>
      </Link>
      <div className=" w-full max-w-[100vw] flex items-center flex-col justify-center">
        {Role === 'Resident' && (
          <div className="flex flex-col items-center justify-center">
            <UserDash />
            <UserDetails />
          </div>
        )}
        {Role === 'Security' && (
          <div className="w-full max-w-[100vw] flex items-center justify-center card !border-none p-5">
            <SecurityTabs />
          </div>
        )}
        {Role === 'Owner' && (
          <div className=" w-full max-w-[100vw] flex items-center justify-center card !border-none p-5">
            <OwnerVerify />
          </div>
        )}
      </div>
    </div>
  );
}

export default DashBoard;
