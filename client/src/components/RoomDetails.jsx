import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchRoomDetails, fetchData } from '../utils/Roomutils';
import { useDispatch } from 'react-redux';
import { setApartmentDetails } from '../redux/slice/userSlice';
import { Navigate, NavLink, useParams } from 'react-router-dom';
import { IoMan, IoPeopleCircleSharp } from 'react-icons/io5';
import { CiMail } from 'react-icons/ci';
import { MdOutlineAttachMoney } from 'react-icons/md';
import { HiHomeModern } from 'react-icons/hi2';
import { LuClipboard } from 'react-icons/lu';
import { MdOutgoingMail } from 'react-icons/md';

import { MdCancel } from 'react-icons/md';
import { UserDetailsTabs } from './rsuiteUI/UserDetailsTabs';
import { useSelector } from 'react-redux';

import { getCreatedData, toTitleCase } from '../utils/Roomutils';
function RoomDetails({ apartment_id }) {
  const [isModal, setModal] = useState(false);
  const [roomDetails, setroomDetails] = useState(null);
  const [authority, setAuthorityUsers] = useState([]);
  const [residentusers, setResidentUsers] = useState([]);
  const dispatch = useDispatch();
  const { Role } = useSelector((state) => state.user);
  const handleClipBoard = async () => {
    try {
      await navigator.clipboard.writeText(roomDetails.apartment_id);
      alert('Apartment ID copied to clipboard!');
    } catch (error) {
      console.error(error);
      alert('Failed to copy to clipboard');
    }
  };

  const {
    data: roomData,
    isError: Roomerr,
    isLoading,
  } = useQuery({
    queryKey: ['room', `${apartment_id}`],
    queryFn: () => fetchData(apartment_id),
  });
  useEffect(() => {
    setAuthorityUsers([]);
    setResidentUsers([]);
  }, []);
  useEffect(() => {
    if (roomData) {
      dispatch(setApartmentDetails(roomData.details));
    }
  }, [roomData, dispatch]);

  // Fetching room details
  const {
    data: roomdetailsData,
    isError: detailserror,
    isLoading: detailsloading,
  } = useQuery({
    queryKey: ['details', `${apartment_id}`],
    queryFn: () => fetchRoomDetails(apartment_id),
  });

  useEffect(() => {
    setAuthorityUsers([]);
    setResidentUsers([]);

    if (roomdetailsData && roomdetailsData.roomdetails) {
      setroomDetails(roomdetailsData.roomdetails);
      roomdetailsData.apartment_users.forEach((ele) => {
        if (['Authority', 'Security', 'Owner'].includes(ele.role)) {
          setAuthorityUsers((prev) => [...prev, ele]);
        } else {
          setResidentUsers((prev) => [...prev, ele]);
        }
      });
    } else {
      setroomDetails(null);
    }
  }, [roomdetailsData]);

  return (
    <div className="flex flex-col w-full gap-5 items-center justify-center p-6">
      {isLoading && <div>Loading room data...</div>}
      {detailsloading && <div>Loading room details...</div>}
      {Roomerr && <div>Error fetching room data</div>}
      {detailserror && <div>Error fetching room details</div>}

      {roomDetails && (
        <div className="max-w-[70vw] w-full flex flex-col items-start justify-center gap-6">
          <div className="text-5xl w-full flex items-center justify-between pl-6 text-red-700">
            <span>About My Apartment</span>
          </div>
          {/* Avatar and Apartment Name */}
          <div className="bg-white rounded-lg p-6 flex items-center gap-4">
            <NavLink to={`/room/${roomDetails?.apartment_id}`}>
              <img
                src={`https://api.dicebear.com/9.x/initials/svg?seed=${roomDetails?.apartment_name}&radius=50`}
                className="w-[80px] h-[80px] object-cover rounded-full"
                alt="avatar"
              />
            </NavLink>
            <NavLink to={`/room/${roomDetails?.apartment_id}`}>
              <span className="text-4xl font-semibold">
                {toTitleCase(roomDetails?.apartment_name)}
              </span>
            </NavLink>
            {Role === 'Owner' && (
              <div
                onClick={() => {
                  setModal(true);
                }}
                className=" btn bg-[#333] flex items-center justify-center gap-2 hover:bg-[#444] text-white cursor-pointer"
              >
                <span>Manage Users</span>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="p-6 flex flex-col gap-4 min-w-[55vw]">
            {/* Common container to align labels and inputs */}
            <div className="w-full space-y-4">
              {/* Owner */}
              <div className="flex items-center gap-3">
                <span className="label !text-lg flex gap-1 items-center min-w-64 text-nowrap">
                  <IoMan size={25} /> Owner
                </span>
                <input
                  type="text"
                  disabled
                  className="text-base w-full bg-gray-100 p-2 rounded-md"
                  value={toTitleCase(roomDetails?.ownername) || 'No Owner'}
                />
              </div>

              {/* Apartment ID */}
              <div className="flex items-center gap-3">
                <span className="label !text-lg flex gap-1 items-center min-w-64 text-nowrap">
                  <HiHomeModern size={25} /> Apartment ID
                </span>
                <div className="flex items-center gap-1 w-full">
                  <input
                    type="text"
                    disabled
                    className="text-base w-full bg-gray-100 p-2 rounded-md"
                    value={roomDetails?.apartment_id || 'N/A'}
                  />
                  <span
                    className="hover:cursor-pointer"
                    onClick={handleClipBoard}
                  >
                    <LuClipboard size={15} />
                  </span>
                </div>
              </div>

              {/* No of Residents */}
              <div className="flex items-center gap-3">
                <span className="label !text-lg flex gap-1 items-center min-w-64 text-nowrap">
                  <IoPeopleCircleSharp size={25} /> No of Residents
                </span>
                <input
                  type="text"
                  disabled
                  className="text-base w-full bg-gray-100 p-2 rounded-md"
                  value={roomDetails?.resident_id.length || 0}
                />
              </div>

              {/* Emergency Email */}
              <div className="flex items-center gap-3">
                <span className="label !text-lg flex gap-1 items-center min-w-64 text-nowrap">
                  <CiMail size={25} /> Emergency Email
                </span>
                <input
                  type="text"
                  disabled
                  className="text-base w-full bg-gray-100 p-2 rounded-md"
                  value={roomDetails?.emergency_email || 'N/A'}
                />
              </div>

              {/* Subscription */}
              <div className="flex items-center gap-3">
                <span className="label !text-lg flex gap-1 items-center min-w-64 text-nowrap">
                  <MdOutlineAttachMoney size={25} /> Subscription
                </span>
                <input
                  type="text"
                  disabled
                  className="text-base w-full bg-gray-100 p-2 rounded-md"
                  value={roomDetails?.subscription || 'N/A'}
                />
              </div>

              {/* Address */}
              <div className="flex items-center justify-center gap-3">
                <span className="label !text-lg flex gap-1 items-center min-w-64 text-nowrap">
                  Address
                </span>
                <input
                  type="text"
                  disabled
                  className="text-base w-full bg-gray-100 p-2 rounded-md"
                  value={roomDetails?.address || 'No Address Available'}
                />
              </div>
              <div className="flex items-center justify-center gap-3">
                <span className="label !text-lg flex gap-1 items-center min-w-64 text-nowrap">
                  State
                </span>
                <input
                  type="text"
                  disabled
                  className="text-base w-full bg-gray-100 p-2 rounded-md"
                  value={roomDetails?.state || 'No Address Available'}
                />
              </div>
              <div className="flex items-center justify-center gap-3">
                <span className="label !text-lg flex gap-1 items-center min-w-64 text-nowrap">
                  PinCode
                </span>
                <input
                  type="text"
                  disabled
                  className="text-base w-full bg-gray-100 p-2 rounded-md"
                  value={roomDetails?.pincode || 'No Address Available'}
                />
              </div>
              <div className="flex items-center justify-center gap-3">
                <span className="label !text-lg flex gap-1 items-center min-w-64 text-nowrap">
                  Start Date
                </span>
                <input
                  type="text"
                  disabled
                  className="text-base w-full bg-gray-100 p-2 rounded-md"
                  value={getCreatedData(roomDetails.createdAt)}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center max-w-[70vw] min-w-[55vw] gap-8">
            {/* Authority Users Section */}
            <div className="w-full">
              <div className="text-3xl w-full flex items-start justify-center gap-4 text-red-700 border-b-[1px] pb-2">
                Authority Users
              </div>
              <div className="flex flex-col gap-4 w-full mt-4">
                {authority.map((user) => (
                  <div
                    key={user.user_id}
                    className="flex items-center justify-between p-3 border-b-[1px]"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={`https://api.dicebear.com/9.x/initials/svg?seed=${user.username}&radius=50`}
                        className="w-[40px] h-[40px] object-cover rounded-full"
                        alt="avatar"
                      />
                      <span>{toTitleCase(user.username)}</span>
                    </div>
                    <NavLink to={'/'}>
                      <span className="cursor-pointer">
                        <MdOutgoingMail size={25} />
                      </span>
                    </NavLink>
                  </div>
                ))}
              </div>
            </div>

            {/* Residents Section (conditionally rendered) */}
            {residentusers.length !== 0 && (
              <div className="w-full">
                <div className="text-3xl w-full flex items-start justify-center gap-4 text-red-700 border-b-[1px] pb-2">
                  Residents
                </div>
                <div className="flex flex-col gap-4 w-full mt-4">
                  {residentusers.map((user) => (
                    <div
                      key={user.user_id}
                      className="flex items-center justify-between p-3 border-b-[1px]"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={`https://api.dicebear.com/9.x/initials/svg?seed=${user.username}&radius=50`}
                          className="w-[40px] h-[40px] object-cover rounded-full"
                          alt="avatar"
                        />
                        <span>{toTitleCase(user.username)}</span>
                      </div>
                      <a
                        href={`mailto:${user.email}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="cursor-pointer">
                          <MdOutgoingMail size={25} />
                        </span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {isModal && (
        <div className="fixed top-1/4   flex justify-center z-50">
          <div className="relative bg-white p-4 rounded-lg shadow-lg">
            <span
              className="absolute top-2 right-2 cursor-pointer"
              onClick={() => setModal(false)}
            >
              <MdCancel size={20} />
            </span>
            <UserDetailsTabs
              roomdetailsData={roomdetailsData}
              apartment_id={apartment_id}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default RoomDetails;
