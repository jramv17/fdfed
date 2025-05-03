import React, { useEffect, useState } from 'react';
import { Box, Typography, Link } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { fetchisRole } from '../../../utils/Roomutils';
import { DataGrid } from '@mui/x-data-grid';
import { useSelector } from 'react-redux';
import { Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { toTitleCase } from '../../../utils/Roomutils';
import MyResponsiveCalendar from '../../nivocharts/CalenderUi';
const OwningApartments = () => {
  const [calenderData, setcalendarData] = useState([]);
  const navigate = useNavigate();
  const columns = [
    {
      field: 'apartment_name',
      headerName: 'Apartment Name',
      renderCell: (params) => {
        return toTitleCase(params.row.apartment_name);
      },
      flex: 1,
    },
    { field: 'state', headerName: 'State', flex: 1 },
    { field: 'registration_num', headerName: 'Registration Number', flex: 1 },
    {
      field: 'subscription',
      headerName: 'Subscription',
      flex: 0.7,
      renderCell: (params) => {
        const color = params.row.subscription === 'Basic' ? 'green' : 'red';
        return (
          <Tag color={color} key={params.row.subscription}>
            {params.row.subscription?.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      field: 'createdAt',
      headerName: 'Started At',
      flex: 1,
      renderCell: (params) => {
        const date = new Date(params.row.createdAt);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      },
    },
    {
      field: 'emergency_email',
      headerName: 'Emergency Email',
      flex: 1,
      renderCell: (params) => {
        return params.row.emergency_email;
      },
    },
    { field: 'pincode', headerName: 'PinCode', flex: 0.5 },

    {
      headerName: 'More Info',
      flex: 0.5,
      renderCell: (params) => {
        return (
          <Link
            component="button"
            variant="body2"
            onClick={() => {
              navigate(`/dash/apartment/${params.row.apartment_id}`);
            }}
          >
            More Info
          </Link>
        );
      },
    },
  ];
  const { username } = useSelector((state) => state.user.userDetails);
  const {
    data: apartment_details,
    isError,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['owning_apartments', username],
    queryFn: () => fetchisRole('Owner'),
    enabled: !!username,
  });
  console.log(apartment_details);
  useEffect(() => {
    const groupedData = apartment_details?.details.reduce((acc, ele) => {
      const day = ele.createdAt.slice(0, 10);

      if (acc[day]) {
        acc[day].value++;
      } else {
        acc[day] = { day, value: 1 };
      }

      return acc;
    }, {});

    const resultArray = Object.values(groupedData || {});
    setcalendarData(resultArray);
  }, [apartment_details]);
  return (
    <Box
      m={'1.5rem 2.5rem '}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '3rem',
      }}
    >
      <Box
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
        sx={{
          height: '700px',
          backgroundColor: 'background.paper',
          padding: '0.5rem 1rem',
          borderRadius: '0.5rem',
          gap: '1rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          cursor: 'pointer',
          transition: 'background-color 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: 'background.paperHover',
          },
        }}
      >
        <Typography
          width={'100%'}
          textAlign={'left'}
          component={'h1'}
          variant="h4"
          fontWeight={'bold'}
          sx={{ mb: '1rem' }}
        >
          Owning Apartments
        </Typography>
        <DataGrid
          rowsPerPageOptions={[10, 20, 50]}
          rows={apartment_details?.details || []}
          loading={isLoading || !apartment_details}
          columns={columns}
          getRowId={(row) => `${row.apartment_name}-${row.pincode}`}
          sx={{
            height: '600px',
            width: '100%',
            bgcolor: 'background.paper',
          }}
        />
      </Box>

      <Box
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
        sx={{
          height: '500px',
          backgroundColor: 'background.paper',
          padding: '0.5rem 1rem',
          borderRadius: '0.5rem',
          gap: '1rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          cursor: 'pointer',
          transition: 'background-color 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: 'background.paperHover',
          },
        }}
      >
        <Typography
          width={'100%'}
          textAlign={'left'}
          component={'h1'}
          variant="h4"
          fontWeight={'bold'}
          sx={{ mb: '1rem' }}
        >
          Over The Year Apartment Registration
        </Typography>
        <MyResponsiveCalendar data={calenderData} />
      </Box>
    </Box>
  );
};

export default OwningApartments;
