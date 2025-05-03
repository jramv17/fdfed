import React, { useState, useEffect } from 'react';
import { fetchisRole, fetchRoomDetails } from '../utils/Roomutils';
import { useQuery } from '@tanstack/react-query';
import '../css/Parcel.css';

const AddParcel = () => {
  const [apartmentId, setApartmentId] = useState(null);
  const [apartmentUsers, setApartmentUsers] = useState([]);

  const [formData, setFormData] = useState({
    apartment_id: apartmentId,
    residentName: '',
    parcelReachedTime: '',
    parcelType: '',
    senderAddress: '',
  });
  
  const [errors, setErrors] = useState({});

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleResidentChange = (e) => {
    setFormData({
      ...formData,
      residentName: e.target.value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.residentName)
      newErrors.residentName = 'Resident name is required.';
    if (!formData.parcelReachedTime)
      newErrors.parcelReachedTime = 'Parcel time is required.';
    if (!formData.parcelType) newErrors.parcelType = 'Parcel type is required.';
    if (!formData.senderAddress)
      newErrors.senderAddress = 'Sender address is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Set the apartment_id in the formData before submitting
    const updatedFormData = {
      ...formData,
      apartment_id: apartmentId,
    };

    if (validateForm()) {
      try {
        const response = await fetch(
          'http://localhost:5000/api/residents/add-parcel',
          {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedFormData), // Use updatedFormData here
          }
        );
        if (response.ok) {
          alert('Parcel submitted successfully!');
          setFormData({
            apartment_id: apartmentId,
            residentName: '',
            parcelReachedTime: '',
            parcelType: '',
            senderAddress: '',
          });
        } else {
          alert('Error submitting parcel!');
        }
      } catch (err) {
        console.error('Error:', err);
      }
    }
  };

  return (
    <div>
      {apartmentId != null ? (
        <div className="container">
          <h1>Parcel Entry - Watchman</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Name:</label>
              <select
                value={formData.residentName}
                onChange={handleResidentChange}
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
              {errors.residentName && (
                <div className="error text-red-500">{errors.residentName}</div>
              )}
            </div>

            <div>
              <label htmlFor="parcelReachedTime">Parcel Reached Time</label>
              <input
                type="datetime-local"
                id="parcelReachedTime"
                value={formData.parcelReachedTime}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
              {errors.parcelReachedTime && (
                <div className="error text-red-500">
                  {errors.parcelReachedTime}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="parcelType">Parcel Type</label>
              <select
                id="parcelType"
                value={formData.parcelType}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Select Parcel Type</option>
                <option value="Normal">Normal</option>
                <option value="Fragile">Fragile</option>
                <option value="Perishable">Perishable</option>
              </select>
              {errors.parcelType && (
                <div className="error text-red-500">{errors.parcelType}</div>
              )}
            </div>

            <div>
              <label htmlFor="senderAddress">Sender Address</label>
              <input
                type="text"
                id="senderAddress"
                value={formData.senderAddress}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
              {errors.senderAddress && (
                <div className="error text-red-500">{errors.senderAddress}</div>
              )}
            </div>

            <input
              type="submit"
              value="Submit"
              className="w-full mt-4 px-3 py-2 bg-blue-500 text-white rounded-lg"
            />
          </form>
        </div>
      ) : (
        <div className="text-center">
          You cannot access this page as you are not authorized as security.
        </div>
      )}
    </div>
  );
};

export default AddParcel;
