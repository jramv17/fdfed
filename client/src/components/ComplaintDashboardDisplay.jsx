import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ApartmentComplaints } from './antDesignUI/TableUi';
import { ApartmentComplaintsPie } from './nivocharts/PieChart';
function ComplaintDashboardDisplay({ apartment_id }) {
  const [isLoading, setIsLoading] = useState(true);
  const [roomData, setComplaints] = useState(null);
  const [data, setData] = useState([]);
  const [piedata, setPieData] = useState([]);
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
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, [apartment_id]);

  useEffect(() => {
    const getData = () => {
      if (roomData) {
        // Initialize the counters for "Yes" and "No"
        let yesCount = 0;
        let noCount = 0;

        // Map the complaint data and count occurrences of "Yes" and "No"
        const arr = roomData.map((ele) => {
          // Count isSolved occurrences
          if (ele.isSolved) {
            yesCount++;
          } else {
            noCount++;
          }

          // Return the mapped complaint data
          return {
            username: ele.username,
            complaintTitle: ele.complaintTitle,
            complaintDetail: ele.complaintDetail,
            isSolved: ele.isSolved ? 'Yes' : 'No',
          };
        });

        // Set the complaint data for displaying in the table
        setData(arr);

        // Prepare and set the status data for "Yes" and "No"
        const statusData = [
          {
            id: 'Yes',
            label: 'Yes',
            value: yesCount,
            color: 'hsl(87, 70%, 50%)',
          },
          {
            id: 'No',
            label: 'No',
            value: noCount,
            color: 'hsl(74, 70%, 50%)',
          },
        ];

        // Assuming you want to set the status data separately, you can have another state like:
        // setStatusData(statusData); // If there's a state for this
        setPieData(statusData); // Or log the data to check
      }
    };

    getData(); // Call the function to execute it
  }, [roomData]);

  if (isLoading) {
    return <div>Loading...</div>; // Optionally, show a loading state
  }

  return (
    <div className="w-full flex flex-col gap-4 items-center justify-center">
      <div className="text-4xl text-red-600"> Apartment Complaints</div>
      <ApartmentComplaints data={data} />
      <div className="w-full flex items-center justify-center gap-4 h-[40vh]">
        <ApartmentComplaintsPie data={piedata} />
      </div>
    </div>
  );
}

export { ComplaintDashboardDisplay };
