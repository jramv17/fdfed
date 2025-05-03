import React, { useEffect, useState, Suspense } from 'react';
const LeftSideDash = React.lazy(() => import('../components/LeftSideDash'));
import { useParams } from 'react-router-dom';
import { NavLink, Link } from 'react-router-dom';
import { IoIosChatbubbles } from 'react-icons/io';
import { useLocation } from 'react-router-dom';
import AnnoucementDetails from '../components/AnnoucementDetails';
import RoomDetails from '../components/RoomDetails';
import UserLogDetails from '../components/UserLogDetails';
import UserComplaints from '../components/UserComplaints';
import ViewParcels from '../components/ParcelViewer';
function Room() {
  const location = useLocation();
  const { apartment_id } = useParams();

  return (
    <div className="w-full h-inherit flex items-center justify-end">
      <Suspense fallback={<div>.............</div>}>
        <LeftSideDash />
      </Suspense>
      <div
        className="min-h-screen flex items-start justify-center"
        style={{ width: `calc(100vw - 275px)` }}
      >
        <div
          className="fixed top-[69px] border-t-[0.8px] border-style border-b-[0.8px] z-10 bg-white h-[60px] flex items-center justify-start"
          style={{ width: `calc(100vw - 275px)` }}
        >
          <div className="h-full w-full flex items-center pl-5 gap-8">
            <div className="h-full flex items-center">
              <NavLink
                to={`/room/${apartment_id}`}
                className={
                  location.pathname === `/room/${apartment_id}`
                    ? 'text-red-600'
                    : ''
                }
              >
                <span>Announcements</span>
              </NavLink>
            </div>

            <div className="h-full flex items-center">
              <NavLink
                to={`/room/${apartment_id}/details`}
                className={({ isActive }) => (isActive ? 'text-red-600' : '')}
              >
                <span>Details</span>
              </NavLink>
            </div>

            <div className="h-full  flex items-center">
              <NavLink
                to={`/room/${apartment_id}/parcel`}
                className={({ isActive }) => (isActive ? 'text-red-600' : '')}
              >
                <span>Parcel</span>
              </NavLink>
            </div>
            <div className="h-full  flex items-center">
              <NavLink
                to={`/room/${apartment_id}/log`}
                className={({ isActive }) => (isActive ? 'text-red-600' : '')}
              >
                <span>Log</span>
              </NavLink>
            </div>
            <div className="h-full  flex items-center">
              <NavLink
                to={`/room/${apartment_id}/complaints`}
                className={({ isActive }) => (isActive ? 'text-red-600' : '')}
              >
                <span>Complaints</span>
              </NavLink>
            </div>

            <div className="h-full  flex items-center">
              <NavLink
                to={`/room/${apartment_id}/posts`}
                className={({ isActive }) => (isActive ? 'text-red-600' : '')}
              >
                <span> Posts</span>
              </NavLink>
            </div>
          </div>
          <Link to={`/room/${apartment_id}/chat`}>
            <div className="mr-6 btn bg-[#333] flex items-center justify-center gap-2 hover:bg-[#444] text-white cursor-pointer">
              <IoIosChatbubbles size={15} />
              <span>Chat</span>
            </div>
          </Link>
        </div>
        {location.pathname === `/room/${apartment_id}` && (
          <div className="mt-[69px] w-full p-6 flex flex-col items-center justify-center gap-5">
            <AnnoucementDetails apartment_id={apartment_id} />
          </div>
        )}
        {location.pathname === `/room/${apartment_id}/details` && (
          <div className="mt-[69px] max-w-[calc(100vw-275px)] w-full p-6 flex flex-col items-center justify-center gap-5">
            <RoomDetails apartment_id={apartment_id} />
          </div>
        )}
        {location.pathname === `/room/${apartment_id}/log` && (
          <div className="mt-[69px] max-w-[calc(100vw-275px)] w-full p-6 flex flex-col items-center justify-center gap-5">
            <UserLogDetails apartment_id={apartment_id} />
          </div>
        )}
        {location.pathname === `/room/${apartment_id}/parcel` && (
          <div className="mt-[69px] max-w-[calc(100vw-275px)] w-full p-6 flex flex-col items-center justify-center gap-5">
            <ViewParcels apartment_id={apartment_id} />
          </div>
        )}
        {location.pathname === `/room/${apartment_id}/complaints` && (
          <div className="mt-[69px] max-w-[calc(100vw-275px)] w-full p-6 flex flex-col items-center justify-center gap-5">
            <UserComplaints apartment_id={apartment_id} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Room;
