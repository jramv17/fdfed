import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Complaint({ apartment_id }) {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/complaints/${apartment_id}`,
          { withCredentials: true }
        );
        setComplaints(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [apartment_id]);

  const handleCheckboxChange = async (complaintId, isSolved) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/complaints/update-is-solved/${complaintId}`,
        { isSolved },
        { withCredentials: true }
      );

      // Update the local state to reflect the change
      setComplaints((prevComplaints) =>
        prevComplaints.map((complaint) =>
          complaint._id === complaintId ? { ...complaint, isSolved } : complaint
        )
      );
    } catch (error) {
      console.error('Error updating complaint status:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Complaints</h2>
      {complaints.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-300 table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-700 text-left">
              <th className="py-2 px-4 border-b w-1/7">Username</th>
              <th className="py-2 px-4 border-b w-1/7">Flat ID</th>
              <th className="py-2 px-4 border-b w-1/7">Title</th>
              <th className="py-2 pl-8 pr-4 border-b w-1/7">Type</th>
              <th className="py-2 px-4 border-b w-2/7">Details</th>
              <th className="py-2 pl-8 pr-4 border-b w-1/7">Created At</th>
              <th className="py-2 px-4 border-b w-1/7 text-center">
                Is Solved
              </th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((complaint) => (
              <tr key={complaint._id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{complaint.username}</td>
                <td className="py-2 px-4 border-b">{complaint.flat_id}</td>
                <td className="py-2 px-4 border-b">
                  {complaint.complaintTitle}
                </td>
                <td className="py-2 pl-8 pr-4 border-b">
                  {complaint.complaintType}
                </td>
                <td className="py-2 px-4 border-b">
                  {complaint.complaintDetail}
                </td>
                <td className="py-2 pl-8 pr-4 border-b">
                  {new Date(complaint.createdAt).toLocaleString()}
                </td>
                <td className="py-2 px-4 border-b text-center flex justify-center items-center">
                  <input
                    type="checkbox"
                    checked={complaint.isSolved}
                    onChange={() =>
                      handleCheckboxChange(complaint._id, !complaint.isSolved)
                    }
                    className="form-checkbox h-5 w-5 text-gray-600 border-gray-300 rounded"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-700">No complaints found for this apartment.</p>
      )}
    </div>
  );
}

export default Complaint;
