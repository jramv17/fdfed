import React, { useEffect, useState } from 'react';
import {
  getApartmentDetails,
  UserDetailsforApartment,
} from '../utils/DashBoardUtils';
import { useQuery } from '@tanstack/react-query';
import { DataTable, UserApartments_table } from './antDesignUI/TableUi';
import { getCreatedData } from '../utils/Roomutils';
import { IoPeopleCircleSharp } from 'react-icons/io5';
import { CiMail } from 'react-icons/ci';
import { HiHomeModern } from 'react-icons/hi2';
import { toTitleCase } from '../utils/Roomutils';
import { useSelector } from 'react-redux';
import { FaGoogle } from 'react-icons/fa';
import { UserComplaints } from './antDesignUI/TableUi';
import { UserComplaintsPie } from '../components/nivocharts/PieChart';
function UserDash() {
  const [tableData, setTableData] = useState([]);
  const [UserApartments, setUserApartments] = useState([]);
  // useQuery hook should be defined at the top level of the component
  const {
    data: apartment_details,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['apartment_details'],
    queryFn: getApartmentDetails,
  });

  useEffect(() => {
    if (apartment_details) {
      const newTableData = [];
      const userApartmentsData = [];

      if (apartment_details?.apartments) {
        apartment_details.apartments.forEach((ele) => {
          if (ele._id) {
            // Extracting values for table data
            const {
              apartment_name,
              registration_num,
              state,
              subscription,
              pincode,
              createdAt,
              flat_id,
              ownername,
              username,
              address,
              designation,
            } = ele;

            // Setting the data for the table
            newTableData.push({
              name: apartment_name,
              state: state,
              registration_number: registration_num,
              subscription: subscription,
              started_at: getCreatedData(createdAt),
              address: pincode,
            });

            // Setting the data for user apartments
            userApartmentsData.push({
              apt_name: apartment_name,
              name: username,
              owner_name: ownername,
              flat_id: flat_id,
              address: address,
              designation: designation,
            });
          }
        });
      }

      // Set the optimized data to state
      setTableData(newTableData);
      setUserApartments(userApartmentsData);
    }
  }, [apartment_details]);
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading data.</div>;
  }

  return (
    <div className="rounded-md flex flex-col w-full items-center justify-center">
      {/* Title Section */}
      <div className="text-red-700 text-5xl w-full text-center mb-4">
        Apartment Details
      </div>

      {/* DataTable Section */}
      <div className="flex flex-col items-center justify-center max-w-[75vw] w-full mb-6">
        <DataTable data={tableData} />
      </div>

      {/* UserApartments Table Section */}
      <div className="flex flex-col items-center justify-center max-w-[75vw] w-full">
        <UserApartments_table data={UserApartments} />
      </div>
    </div>
  );
}

function UserDetails() {
  const [UserData, setUserData] = useState(null);
  const { username } = useSelector((state) => state.user.userDetails);

  const {
    data: user_details,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['apartment_details', username],
    queryFn: UserDetailsforApartment,
  });
  useEffect(() => {
    if (user_details) {
      setUserData(user_details);
    } else {
      setUserData(null);
    }
  }, [user_details]);

  // Check if data is still loading
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Check if there was an error loading the data
  if (isError) {
    return <div>Error loading data.</div>;
  }

  return (
    <div className="flex flex-col  item-center justify-center min-w-[55vw]">
      <div className="p-6 flex flex-col gap-6 w-full max-w-[80vw] text-gray-800">
        <div className="w-full flex items-center justify-start text-3xl text-red-700">
          My Details
        </div>

        {/* User Details */}
        <div className="flex items-center gap-3">
          <span className="label !text-lg flex gap-1 items-center min-w-64 text-gray-700">
            Username
          </span>
          <input
            type="text"
            disabled
            className="text-base w-full bg-gray-200 p-2 rounded-md text-gray-900"
            value={toTitleCase(user_details?.user?.username) || 'No Owner'}
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="label !text-lg flex gap-1 items-center min-w-64 text-gray-700">
            <HiHomeModern size={25} className="text-gray-500" /> User ID
          </span>
          <input
            type="text"
            disabled
            className="text-base w-full bg-gray-200 p-2 rounded-md text-gray-900"
            value={user_details?.user?.uuid || 'N/A'}
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="label !text-lg flex gap-1 items-center min-w-64 text-gray-700">
            <IoPeopleCircleSharp size={25} className="text-gray-500" /> No of
            Apartments
          </span>
          <input
            type="text"
            disabled
            className="text-base w-full bg-gray-200 p-2 rounded-md text-gray-900"
            value={user_details?.apartments?.length || 0}
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="label !text-lg flex gap-1 items-center min-w-64 text-gray-700">
            <CiMail size={25} className="text-gray-500" /> Email
          </span>
          <input
            type="text"
            disabled
            className="text-base w-full bg-gray-200 p-2 rounded-md text-gray-900"
            value={user_details?.user?.email || ''}
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="label !text-lg flex gap-1 items-center min-w-64 text-gray-700">
            <FaGoogle size={25} className="text-gray-500" /> Google Id
          </span>
          <input
            type="text"
            disabled
            className="text-base w-full bg-gray-200 p-2 rounded-md text-gray-900"
            value={user_details?.user?.isGoogleId ? 'Yes' : 'No'}
          />
        </div>
      </div>

      {/* Complaints Section */}
      <div className="p-6 flex flex-col gap-6 w-full max-w-[80vw] text-gray-800">
        <div className="w-full flex items-center justify-start text-3xl text-red-700">
          My Complaints
        </div>
        {user_details?.complaints ? (
          <UserComplaintsComp data={user_details.complaints} />
        ) : (
          <div>No complaints found.</div>
        )}
      </div>
    </div>
  );
}

function UserComplaintsComp({ data }) {
  const [complaints, setComplaints] = useState([]);
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    let severe = 0;
    let warning = 0;

    if (data && data.length > 0) {
      const arr = data.map((ele) => {
        if (ele.severity === 'warning') {
          warning++;
        } else if (ele.severity === 'severe') {
          // Added check to ensure it counts only 'severe'
          severe++;
        }
        return {
          apartment_name: ele.apartment_name,
          complaints: ele.complaints,
          severity: ele.severity,
          createdAt: getCreatedData(ele.createdAt),
        };
      });
      setComplaints(arr);
    } else {
      setComplaints([]); // Default to an empty array if data is null or empty
    }

    setPieData([
      {
        id: 'severe',
        label: 'Severe',
        value: severe,
        color: 'hsl(210, 70%, 50%)',
      },
      {
        id: 'warning',
        label: 'Warning',
        value: warning,
        color: 'hsl(350, 70%, 50%)',
      },
    ]);
  }, [data]);

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {complaints.length > 0 ? (
        <UserComplaints data={complaints} />
      ) : (
        <div>No complaints available</div>
      )}
      {/* You can render your pie chart here using pieData */}
      <div className=" w-full flex items-center justify-center gap-4 h-[40vh]">
        <UserComplaintsPie data={pieData} />
      </div>
    </div>
  );
}

export { UserDash, UserDetails };
