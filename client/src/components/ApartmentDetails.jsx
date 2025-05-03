/* eslint-disable no-useless-escape */
import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchData } from '../utils/Roomutils';
import { IoMan, IoPeopleCircleSharp } from 'react-icons/io5';
import { CiMail } from 'react-icons/ci';
import { MdOutlineAttachMoney } from 'react-icons/md';
import { HiHomeModern } from 'react-icons/hi2';
import axios from 'axios';
import { toTitleCase, getCreatedData } from '../utils/Roomutils';

function ApartmentDetails({ apartment_id }) {
  const [isEdit, setEdit] = useState(false); // Changed variable for clarity
  const [room, setRoom] = useState(null);
  const [email, setEmail] = useState('');

  // Fetch data using the useQuery hook
  const {
    data: roomData,
    isError: roomError,
    isLoading,
  } = useQuery({
    queryKey: ['room', `${apartment_id}`],
    queryFn: () => fetchData(apartment_id),
  });
  useEffect(() => {
    if (roomData) {
      setRoom(roomData.room || {});
      setEmail(roomData.room?.emergency_email || '');
    }
  }, [roomData]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const SaveChanges = async () => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
      setEdit(false);
      return;
    }
    axios.defaults.withCredentials = true;
    try {
      const response = await axios.put(
        'http://localhost:5000/createRoom/edit-email',
        {
          apartment_id,
          email,
        }
      );
      setRoom((prev) => ({ ...prev, emergency_email: email }));
      setEdit(false);
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  if (isLoading) return <p>Loading apartment details...</p>;
  if (roomError) return <p>Error loading room data: {roomError.message}</p>;

  return (
    <div className="p-6 flex flex-col gap-6 min-w-[55vw] max-w-[80vw] bg-gray-50 text-gray-800">
      {/* Common container to align labels and inputs */}
      <div className="w-full space-y-2">
        {/* Owner */}
        <div className="flex items-center gap-3">
          <span className="label !text-lg flex gap-1 items-center min-w-64 text-gray-700">
            <IoMan size={25} className="text-gray-500" /> Owner
          </span>
          <input
            type="text"
            disabled
            className="text-base w-full bg-gray-200 p-2 rounded-md text-gray-900"
            value={toTitleCase(room?.ownername) || 'No Owner'}
          />
        </div>

        {/* Apartment ID */}
        <div className="flex items-center gap-3">
          <span className="label !text-lg flex gap-1 items-center min-w-64 text-gray-700">
            <HiHomeModern size={25} className="text-gray-500" /> Apartment ID
          </span>
          <div className="flex items-center gap-1 w-full">
            <input
              type="text"
              disabled
              className="text-base w-full bg-gray-200 p-2 rounded-md text-gray-900"
              value={room?.apartment_id || 'N/A'}
            />
          </div>
        </div>

        {/* No of Residents */}
        <div className="flex items-center gap-3">
          <span className="label !text-lg flex gap-1 items-center min-w-64 text-gray-700">
            <IoPeopleCircleSharp size={25} className="text-gray-500" /> No of
            Residents
          </span>
          <input
            type="text"
            disabled
            className="text-base w-full bg-gray-200 p-2 rounded-md text-gray-900"
            value={room?.resident_id?.length || 0}
          />
        </div>

        {/* Emergency Email */}
        <div className="flex items-center gap-3">
          <span className="label !text-lg flex gap-1 items-center min-w-64 text-gray-700">
            <CiMail size={25} className="text-gray-500" /> Emergency Email
          </span>
          <input
            type="text"
            disabled={!isEdit}
            className="text-base w-full bg-gray-200 p-2 rounded-md text-gray-900"
            value={email}
            onChange={handleEmailChange}
          />
          {!isEdit ? (
            <a
              href="#"
              className="text-blue-500 hover:underline"
              onClick={(e) => {
                e.preventDefault();
                setEdit(true);
              }}
            >
              Edit
            </a>
          ) : (
            <a
              href="#"
              className="text-blue-500 hover:underline"
              onClick={(e) => {
                e.preventDefault();
                SaveChanges();
              }}
            >
              Save
            </a>
          )}
        </div>

        {/* Subscription */}
        <div className="flex items-center gap-3">
          <span className="label !text-lg flex gap-1 items-center min-w-64 text-gray-700">
            <MdOutlineAttachMoney size={25} className="text-gray-500" />{' '}
            Subscription
          </span>
          <input
            type="text"
            disabled
            className="text-base w-full bg-gray-200 p-2 rounded-md text-gray-900"
            value={room?.subscription || 'N/A'}
          />
        </div>

        {/* Address */}
        <div className="flex items-center gap-3">
          <span className="label !text-lg flex gap-1 items-center min-w-64 text-gray-700">
            Address
          </span>
          <input
            type="text"
            disabled
            className="text-base w-full bg-gray-200 p-2 rounded-md text-gray-900"
            value={room?.address || 'No Address Available'}
          />
        </div>

        {/* State */}
        <div className="flex items-center gap-3">
          <span className="label !text-lg flex gap-1 items-center min-w-64 text-gray-700">
            State
          </span>
          <input
            type="text"
            disabled
            className="text-base w-full bg-gray-200 p-2 rounded-md text-gray-900"
            value={room?.state || 'No State Available'}
          />
        </div>

        {/* PinCode */}
        <div className="flex items-center gap-3">
          <span className="label !text-lg flex gap-1 items-center min-w-64 text-gray-700">
            PinCode
          </span>
          <input
            type="text"
            disabled
            className="text-base w-full bg-gray-200 p-2 rounded-md text-gray-900"
            value={room?.pincode || 'No PinCode Available'}
          />
        </div>

        {/* Start Date */}
        <div className="flex items-center gap-3">
          <span className="label !text-lg flex gap-1 items-center min-w-64 text-gray-700">
            Start Date
          </span>
          <input
            type="text"
            disabled
            className="text-base w-full bg-gray-200 p-2 rounded-md text-gray-900"
            value={getCreatedData(room?.createdAt)}
          />
        </div>
      </div>
    </div>
  );
}

export default ApartmentDetails;
