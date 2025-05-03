import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserRooms from '../components/UserRooms';
import { MdCancel } from 'react-icons/md';
import JoinRoomModal from '../components/JoinRoomModal';
import { FaPlus } from 'react-icons/fa';
import src from '/noroom.png';
import LeftSideDash from '../components/LeftSideDash';
import { useDispatch } from 'react-redux';
import {
  toggleSideBar,
  toggleIconVisibility,
} from '../redux/slice/SideDashSlice';
const NoRoom = ({ setModal }) => {
  return (
    <div className="h-[80vh] flex flex-col items-center justify-center gap-5">
      <div className="flex gap-3 items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="text-5xl text-nowrap">
            You Have Not Joined Any Apartment Till Now
          </div>
          <span className="text-2xl text-nowrap">Start With Us</span>
        </div>
        <div>
          <img src={src} alt="No Room" className="h-[300px] w-[300px]" />
        </div>
      </div>
      <div
        className="btn cursor-pointer text-2xl bg-[#333] flex items-center justify-center gap-4 mr-6 hover:bg-[#444] text-white"
        onClick={() => setModal(true)}
      >
        <FaPlus size={15} />
        <span>Join Room</span>
      </div>
    </div>
  );
};

function MyRooms() {
  const dispatch = useDispatch();
  axios.defaults.withCredentials = true;
  const [isLoading, setLoading] = useState(true);
  const [isEmpty, setEmpty] = useState(false);
  const [data, setData] = useState([]);
  const [isModal, setModal] = useState(false);

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/my-rooms');
        if (response.status === 200) {
          setEmpty(true);
        } else if (response.status === 201) {
          setData(response.data);
          setEmpty(false);
        }
      } catch (error) {
        console.error(error);
        setEmpty(true);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();
  }, []);
  useEffect(() => {
    dispatch(toggleIconVisibility(!isEmpty));
  }, [isEmpty]);

  return (
    <div className=" min-w-[100vw]  flex items-start justify-center">
      {isLoading ? (
        'Loading...'
      ) : isEmpty ? (
        <NoRoom setModal={setModal} />
      ) : (
        <div className="w-full  h-inherit flex items-center justify-around">
          <LeftSideDash />
          <UserRooms
            data={data.details}
            isModal={isModal}
            setModal={setModal}
          />
        </div>
      )}

      {isModal && (
        <div className="fixed top-1/4 left-0 right-0 flex justify-center z-50">
          <div className="relative bg-white p-4 rounded-lg shadow-lg">
            <span
              className="absolute top-2 right-2 cursor-pointer"
              onClick={() => setModal(false)}
            >
              <MdCancel size={20} />
            </span>
            <JoinRoomModal />
          </div>
        </div>
      )}
    </div>
  );
}

export default MyRooms;
