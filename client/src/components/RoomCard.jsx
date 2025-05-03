import React from 'react';
import {
  backgroundColors,
  getApartmentId,
  getCreatedData,
  toTitleCase,
} from '../utils/Roomutils';

function RoomCard({ roomData, id }) {
  const apartment_id = getApartmentId(roomData.apartment_id);
  const createddate = getCreatedData(roomData.start_date);
  const { color: backgroundColor, shadow } =
    backgroundColors[id % backgroundColors.length];

  return (
    <div
      className="h-52 w-[350px] flex flex-col p-4 pt-1 rounded-lg cursor-pointer hover:scale-[1.02]"
      style={{
        background: backgroundColor,
        boxShadow: shadow,
      }}
    >
      <div className="h-1/2 flex items-center justify-left w-full">
        <span className="text-2xl font-semibold text-left">
          {toTitleCase(roomData.apartment_name)}
        </span>
      </div>
      <div className="flex flex-col items-end justify-end h-1/2 p-2 overflow-clip text-nowrap w-full">
        <span className="text-base font-medium">{apartment_id}</span>
        <span className="text-base w-[85%] truncate text-ellipsis  overflow-clip hover-underline flex justify-end">
          {roomData.ownername}
        </span>
        <span className="text-sm">{createddate}</span>
      </div>
    </div>
  );
}

export default RoomCard;
