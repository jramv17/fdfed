import React from 'react';
import RoomCard from './RoomCard';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import LeftSideDash from './LeftSideDash';
const UserRooms = ({ data, setModal, isModal }) => {
  return (
    <div className="min-w-[80vw] w-[85vw] flex mt-4 flex-col items-center justify-center gap-6 pb-4">
      <div className="flex w-full flex-row-reverse  cursor-pointer">
        <div
          className="btn bg-[#333] flex items-center justify-center gap-2 mr-2 hover:bg-[#444] text-white"
          onClick={() => setModal(true)}
        >
          <FaPlus size={15} />
          <span>Join Room</span>
        </div>
      </div>
      <div className="w-full flex items-center justify-end">
        <div className="grid grid-cols-3 w-fit gap-y-5 gap-x-9">
          {data.map((room, i) => {
            return (
              <Link key={i} to={`/room/${room.apartment_id}`}>
                <RoomCard roomData={room} id={i} />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UserRooms;
