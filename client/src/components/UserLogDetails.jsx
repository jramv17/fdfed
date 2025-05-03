import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchData } from '../utils/Roomutils';
import { useDispatch } from 'react-redux';
import { setApartmentDetails } from '../redux/slice/userSlice';
const UserLogDetails = ({ apartment_id }) => {
  const dispatch = useDispatch();
  const {
    data: roomData,
    isError: roomerr,
    isLoading,
  } = useQuery({
    queryKey: ['room', `${apartment_id}`],
    queryFn: () => {
      return fetchData(apartment_id);
    },
  });
  useEffect(() => {
    if (roomData) {
      dispatch(setApartmentDetails(roomData));
    }
  }, [roomData, dispatch]);
  const { resident_id } = useParams();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [guests, setGuestList] = useState([]);
  // Fetch log details when the component mounts
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/residents/${apartment_id}`,
          {
            credentials: 'include',
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch log details');
        }
        const data =await  response.json();
        console.log(data);
        if (Array.isArray(data)) {
          setLogs(data);
        }
        const guest_res = await fetch(
          `http://localhost:5000/api/residents/get-guests/${apartment_id}`,
          {
            credentials: 'include',
          }
        );
        const guests = await guest_res.json();
        setGuestList(guests);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [apartment_id]);

  if (loading) return <p>Loading log details...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-col gap-3">
      <div className="container mx-auto mt-8">
        <h2 className="text-2xl font-header">
          Log Details for the Apartment ID {resident_id}
        </h2>
        <table className="table-auto w-full text-left border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 border-b border-gray-300">Name</th>
              <th className="py-3 px-6 border-b border-gray-300">Entry Time</th>
              <th className="py-3 px-6 border-b border-gray-300">Exit Time</th>
              <th className="py-3 px-6 border-b border-gray-300">
                Log Timestamp
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {logs.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  No log entries found.
                </td>
              </tr>
            ) : (
              logs.map((log, index) => (
                <tr key={index} className="hover:bg-gray-100 cursor-pointer">
                  <td className="py-3 px-6 border-b border-gray-300">
                    {log.name}
                  </td>
                  <td className="py-3 px-6 border-b border-gray-300">
                    {new Date(log.entry_time).toLocaleString()}
                  </td>
                  <td className="py-3 px-6 border-b border-gray-300">
                    {new Date(log.exit_time).toLocaleString()}
                  </td>
                  <td className="py-3 px-6 border-b border-gray-300">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="container mx-auto mt-8">
        <h2 className="text-2xl font-header">
          Guest Log Details for the Apartment ID {resident_id}
        </h2>
        <table className="table-auto w-full text-left border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 border-b border-gray-300">Name</th>
              <th className="py-3 px-6 border-b border-gray-300">Flat Id</th>
              <th className="py-3 px-6 border-b border-gray-300">
                Log Timestamp
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {guests.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  No log entries found.
                </td>
              </tr>
            ) : (
              guests.map((log, index) => (
                <tr key={index} className="hover:bg-gray-100 cursor-pointer">
                  <td className="py-3 px-6 border-b border-gray-300">
                    {log.name}
                  </td>
                  <td className="py-3 px-6 border-b border-gray-300">
                    {log.flat_no}
                  </td>
                  <td className="py-3 px-6 border-b border-gray-300">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserLogDetails;
