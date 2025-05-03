import React from 'react';
import roomcard1 from '/roomcard1.jpeg';
import roomcard2 from '/roomcard2.jpeg';
import roomcard3 from '/roomcard3.jpeg';
import roomcard4 from '/roomcard4.jpeg';
import roomcard5 from '/roomcard5.jpeg';
import { toTitleCase } from '../utils/Roomutils';
const RoomCards = [roomcard1, roomcard2, roomcard3, roomcard4, roomcard5];
const RandomRoomCard = () => {
  const randomIndex = Math.floor(Math.random() * RoomCards.length);
  return RoomCards[randomIndex];
};
function RoomHeadingCard({ apartment_name, owner_name }) {
  return (
    <div
      className="w-full h-[40vh] flex flex-col justify-end bg-cover bg-center rounded"
      style={{ backgroundImage: `url(${RandomRoomCard()})` }}
    >
      <div className=" w-full p-4 flex flex-col gap-3 items-start text-white">
        <span className="text-3xl font-semibold">
          {toTitleCase(apartment_name)}
        </span>
        <span className="text-xl">{toTitleCase(owner_name)}</span>
      </div>
    </div>
  );
}

export default RoomHeadingCard;
