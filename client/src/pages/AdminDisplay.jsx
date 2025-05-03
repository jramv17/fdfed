import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns'; // Library to help format dates
import {
  AdminApartmentsDisplay,
  UserAdminTable,
} from '../components/antDesignUI/TableUi';
import { getCreatedData } from '../utils/Roomutils';
import { AdminSubcheckpie } from '../components/nivocharts/PieChart';
function AdminDisplay() {
  axios.defaults.withCredentials = true;
  const [apartments, setApartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [apartments_sub, setApartmentsPie] = useState([]);
  const [lineChartData, setLineChartData] = useState([]); // New state for line chart data

  useEffect(() => {
    const fetchAdminData = async () => {
      let basic = 0;
      let premium = 0;
      try {
        const response = await axios.get('http://localhost:5000/admin/details');
        if (response.status === 200) {
          // Process apartments data
          const apartments_table = response.data.apartments?.map((ele) => {
            if (ele.subscription === 'Basic') {
              basic++;
            } else {
              premium++;
            }
            return {
              apartment_name: ele.apartment_name,
              ownername: ele.ownername,
              address: ele.address,
              subscription: ele.subscription,
              no_of_residents: ele.resident_id.length, // Assuming resident_id is an array
            };
          });

          // Process users data
          const users_table = response.data.users?.map((ele) => {
            return {
              username: ele.username,
              email: ele.email,
              started_at: getCreatedData(ele.createdAt),
              googleaccount: ele.isGoogleId ? 'Yes' : 'No',
            };
          });

          // Prepare pie chart data
          const statusData = [
            {
              id: 'Basic',
              label: 'Basic',
              value: basic,
              color: 'hsl(87, 70%, 50%)',
            },
            {
              id: 'Premium',
              label: 'Premium',
              value: premium,
              color: 'hsl(74, 70%, 50%)',
            },
          ];

          // Prepare line chart data based on createdAt
          const lineChartData = generateLineChartData(response.data.users);

          setApartmentsPie(statusData);
          setApartments(apartments_table);
          setUsers(users_table);
          setLineChartData(lineChartData); // Set line chart data
        }
      } catch (error) {
        console.error(error);
        alert('Error in fetching details: ' + error.message);
      }
    };

    fetchAdminData();
  }, []);

  // Utility function to generate line chart data from users' createdAt
  const generateLineChartData = (users) => {
    const data = {};

    // Group users by month of registration
    users.forEach((user) => {
      const formattedDate = format(new Date(user.createdAt), 'yyyy-MM'); // Format as 'YYYY-MM'
      if (!data[formattedDate]) {
        data[formattedDate] = 1;
      } else {
        data[formattedDate]++;
      }
    });

    // Convert grouped data into chart format
    const chartData = [
      {
        id: 'User Registrations',
        data: Object.keys(data).map((date) => ({
          x: date,
          y: data[date],
        })),
      },
    ];

    return chartData;
  };

  return (
    <div className="w-full items-center justify-center">
      <div className="w-full flex flex-col gap-4">
        <p className="text-red-600 text-3xl w-full flex items-center justify-start">
          Apartments
        </p>
        <AdminApartmentsDisplay data={apartments} />
        <div className="w-full h-[40vh] flex items-center justify-center">
          <AdminSubcheckpie data={apartments_sub} />
        </div>
      </div>
      <div className="w-full flex flex-col gap-4">
        <p className="text-red-600 text-3xl w-full flex items-center justify-start">
          Registered Users
        </p>
        <UserAdminTable data={users} />
      </div>
    </div>
  );
}

export default AdminDisplay;
