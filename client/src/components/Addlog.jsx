import React, { useEffect, useState } from 'react';
import { fetchisRole, fetchRoomDetails } from '../utils/Roomutils';
import { useQuery } from '@tanstack/react-query';
import ReactModal from 'react-modal';
import axios from 'axios';
const AddLog = () => {
  const [apartmentId, setApartmentId] = useState(null);
  const [name, setName] = useState('');
  const [entryTime, setEntryTime] = useState('');
  const [exitTime, setExitTime] = useState('');
  const [apartmentUsers, setApartmentUsers] = useState([]);
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [flatNo, setFlatNo] = useState('');
  const [noOfGuests, setNoOfGuests] = useState(0);
  const [guestNames, setGuestNames] = useState([]);
  const [guestList, setGuestList] = useState([]);

  // Fetch room details only when apartmentId is available
  const {
    data: roomdetailsData,
    isError: detailserror,
    isLoading: detailsloading,
  } = useQuery({
    queryKey: ['details', apartmentId],
    queryFn: () => fetchRoomDetails(apartmentId),
    enabled: !!apartmentId, // Only run query when apartmentId exists
  });

  // Update apartmentUsers only when roomdetailsData is available and has apartment_users
  useEffect(() => {
    if (roomdetailsData?.apartment_users) {
      setApartmentUsers(roomdetailsData.apartment_users);
    } else {
      setApartmentUsers([]); // Ensure it resets if roomdetailsData is undefined
    }
  }, [roomdetailsData]);

  // Fetch security role details and apartmentId
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchisRole('Security');
        if (data?.details?.apartment_id) {
          setApartmentId(data.details.apartment_id);
        } else {
          console.error('You are not authorized as security.');
        }
      } catch (error) {
        console.error('Error fetching role data:', error);
      }
    };
    fetchData();
  }, []);

  // Log function for adding resident logs
  const addLog = async () => {
    try {
      console.log(name,entryTime,exitTime,apartmentId);
      const response = await fetch(
        `http://localhost:5000/api/residents/add-log`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Ensures that cookies are sent with the request
          body: JSON.stringify({
            apartment_id: apartmentId,
            name,
            entry_time: entryTime,
            exit_time: exitTime,
          }),
        }
      );

      if (!response.ok) {
        // If the response is not okay (status not in the range 200-299)
        const errorData = await response.json();
        console.error('Error:', errorData);
        throw new Error(
          `Failed to add log: ${errorData.error || 'Unknown error'}`
        );
      }

      // If the request was successful
      const responseData = await response.json();

      // Clear the input fields after successful submission
      setName('');
      setEntryTime('');
      setExitTime('');
    } catch (error) {
      console.log(error);
      console.error('Error adding log:', error.message);
    }

    //To clear up the fields
    setName('');
    setEntryTime('');
    setExitTime('');
    // Your log logic here
  };

  const closeModal = () => {
    setGuestModalOpen(false);
  };
  const handleAddGuests = async () => {
    try {
      console.log(flatNo, noOfGuests, guestNames);
      if (
        !flatNo ||
        !noOfGuests ||
        !guestNames ||
        guestNames.length != noOfGuests
      ) {
        alert('Invalid data provided');
        return;
      }
      const body = {
        flat_no: flatNo,
        no_of_guests: noOfGuests,
        guest_names: guestNames,
      };
      const response = await axios.post(
        `http://localhost:5000/api/residents/add-guest/${apartmentId}`,
        body,
        {
          withCredentials: true,
        }
      );
      if (response.status === 201) {
        alert('Guests added successfully!');
      }

      // Clear form fields after submitting
      setFlatNo('');
      setNoOfGuests(0);
      setGuestNames([]);
      setGuestModalOpen(false); // Close modal after submitting
    } catch (error) {
      console.log(error);
      console.error('Error adding guests:', error.message);
      alert('Error adding guests');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-gradient-to-br from-gray-100 to-gray-300 rounded-lg shadow-md">
      {apartmentId != null ? (
        <div>
          <h2 className="text-xl font-bold mb-4">Add Log for Resident ID:</h2>
          <button
            onClick={() => setGuestModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
          >
            Add Guests
          </button>
          <ReactModal
            isOpen={guestModalOpen}
            onRequestClose={closeModal}
            className="fixed inset-0 flex items-center justify-center"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
          >
            <div className="bg-white rounded-lg p-6 w-full max-w-md transform translate-y-10">
              <h2 className="text-lg font-bold mb-4 text-center">Add Guests</h2>
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              >
                X
              </button>
              <input
                type="text"
                placeholder="Flat No"
                value={flatNo}
                onChange={(e) => setFlatNo(e.target.value)}
                className="block w-full px-3 py-2 border rounded-lg mb-2"
              />
              <input
                type="number"
                placeholder="Number of Guests"
                value={noOfGuests}
                onChange={(e) => setNoOfGuests(e.target.value)}
                className="block w-full px-3 py-2 border rounded-lg mb-2"
              />
              {Array.from({ length: noOfGuests }, (_, i) => (
                <input
                  key={i}
                  type="text"
                  placeholder={`Guest Name ${i + 1}`}
                  value={guestNames[i] || ''}
                  onChange={(e) => {
                    const updatedNames = [...guestNames];
                    updatedNames[i] = e.target.value;
                    setGuestNames(updatedNames);
                  }}
                  className="block w-full px-3 py-2 border rounded-lg mb-2"
                />
              ))}
              <button
                onClick={handleAddGuests}
                className="bg-green-500 text-white px-4 py-2 rounded w-full"
              >
                Add Guests
              </button>
            </div>
          </ReactModal>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Name:</label>
            <select
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            >
              <option value="" disabled>
                Select a name
              </option>
              {apartmentUsers.length > 0 ? (
                apartmentUsers.map((ele) => (
                  <option key={ele.apartment_id} value={ele.apartment_name}>
                    {ele.apartment_name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No users available
                </option>
              )}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Entry Time:</label>
            <input
              type="datetime-local"
              value={entryTime}
              onChange={(e) => {
                console.log(e.target.value);
                setEntryTime(e.target.value)
              }}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Exit Time:</label>
            <input
              type="datetime-local"
              value={exitTime}
              onChange={(e) => setExitTime(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <button
            onClick={addLog}
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
          >
            Add Log
          </button>
        </div>
      ) : (
        <div className="text-center">
          You cannot access this page as you are not authorized as security.
        </div>
      )}
    </div>
  );
};

export default AddLog;
