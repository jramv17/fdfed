import RoomHeadingCard from './RoomHeadingCard';
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchData } from '../utils/Roomutils';
import { useDispatch, useSelector } from 'react-redux';
import { setApartmentDetails } from '../redux/slice/userSlice';
import Announcement from './Announcement';

function AnnoucementDetails({ apartment_id }) {
  const dispatch = useDispatch();
  const { Role } = useSelector((state) => state.user);
  const isRole = Role === 'Owner' || Role === 'Authority';

  // Fetch room data using react-query
  const {
    data: roomData,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['room', apartment_id], // Use the apartment_id directly without `${}` unless needed
    queryFn: () => fetchData(apartment_id),
  });
  // Store the room data in Redux when it's successfully fetched
  useEffect(() => {
    if (roomData) {
      dispatch(setApartmentDetails(roomData.details));
    }
  }, [roomData, dispatch]);

  // Handle loading and error states
  if (isLoading) {
    return <div>Loading...</div>; // Loading indicator
  }

  if (isError) {
    return <div>Error loading apartment details. Please try again.</div>; // Error message
  }

  // Ensure roomData exists before accessing its properties
  if (!roomData) {
    return <div>No apartment data found.</div>;
  }

  return (
    <div className="flex flex-col w-full gap-5 items-center justify-center p-6">
      <div className="max-w-[70vw] w-[70vw] flex items-center justify-center">
        {/* Display the RoomHeadingCard only when roomData is available */}
        <RoomHeadingCard
          apartment_name={roomData.details.apartment_name}
          owner_name={roomData.details.ownername}
        />
      </div>

      {/* Render Announcement component only when necessary props are available */}
      {
        <Announcement
          apartment_id={apartment_id}
          isRole={isRole}
          Role={Role}
          apartment_username={roomData.details.ownername} // Use safely after ensuring roomData is fetched
        />
      }
    </div>
  );
}

export default AnnoucementDetails;
