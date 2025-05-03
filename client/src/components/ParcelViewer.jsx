import React, { useEffect, useState } from 'react';
import '../css/Parcel.css';

const ViewPage = ({ apartment_id }) => {
  const [parcels, setParcels] = useState([]);
  const [filters, setFilters] = useState({ residentName: '', parcelType: '' });

  useEffect(() => {
    fetchParcels();
  }, []);

  const fetchParcels = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/residents/get-parcels/${apartment_id}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );
      const data = await response.json();
      setParcels(data);
    } catch (error) {
      console.error('Error fetching parcels:', error);
    }
  };

  const handleFilter = () => {
    return parcels.filter((parcel) => {
      return (
        parcel.residentName
          .toLowerCase()
          .includes(filters.residentName.toLowerCase()) &&
        parcel.parcelType
          .toLowerCase()
          .includes(filters.parcelType.toLowerCase())
      );
    });
  };

  return (
    <div className="view-page">
      <h1>Parcel Information</h1>
      <div className="filter-container">
        <label>
          Resident Name:
          <input
            type="text"
            value={filters.residentName}
            onChange={(e) =>
              setFilters({ ...filters, residentName: e.target.value })
            }
            className="filter-input"
            placeholder="Search resident name..."
          />
        </label>
        <label>
          Parcel Type:
          <input
            type="text"
            value={filters.parcelType}
            onChange={(e) =>
              setFilters({ ...filters, parcelType: e.target.value })
            }
            className="filter-input"
            placeholder="Search parcel type..."
          />
        </label>
      </div>
      <table className="parcel-table">
        <thead>
          <tr>
            <th>Resident Name</th>
            <th>Parcel Arrived Date</th>
            <th>Sender Address</th>
            <th>Parcel Type</th>
          </tr>
        </thead>
        <tbody>
          {handleFilter().map((parcel) => (
            <tr key={parcel._id}>
              <td>{parcel.residentName}</td>
              <td>{parcel.parcelReachedTime}</td>
              <td>{parcel.senderAddress}</td>
              <td>{parcel.parcelType}</td>
            </tr>
          ))}
          {handleFilter().length === 0 && (
            <tr>
              <td colSpan="4" className="no-data">
                No parcels found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ViewPage;
