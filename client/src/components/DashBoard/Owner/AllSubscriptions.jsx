import React, { useEffect, useState } from 'react';
import { Box, Typography, Link } from '@mui/material';
import { fetchisRole } from '../../../utils/Roomutils';
import { useQuery } from '@tanstack/react-query';
import { DataGrid } from '@mui/x-data-grid';
import { useSelector } from 'react-redux';
import { Tag } from 'antd';
import { AdminSubcheckpie } from '../../nivocharts/PieChart';
import { useNavigate } from 'react-router-dom';
const Subscriptions = () => {
  const navigate = useNavigate();
  const [pieData, setpieData] = useState([]);
  const { username } = useSelector((state) => state.user.userDetails);
  const columns = [
    {
      field: 'apartment_name',
      headerName: 'Apartment Name',
      flex: 0.5,
    },
    {
      field: 'state',
      headerName: 'State',
      flex: 0.5,
    },
    {
      field: 'subscription',
      headerName: 'Subscription',
      flex: 0.5,
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
      headerName: 'Edit',
      flex: 0.5,
      renderCell: (params) => {
        return (
          <Link
            component="button"
            variant="body2"
            onClick={() => {
              navigate(
                `/dash/apartment/subscription/${params.row.apartment_id}`
              );
            }}
          >
            Subscription Details
          </Link>
        );
      },
    },
  ];
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
  useEffect(() => {
    let basic = 0;
    let premium = 0;

    // Safely iterate over the apartment details
    apartment_details?.details?.forEach((ele) => {
      if (ele.subscription === 'Basic') {
        basic++;
      } else if (ele.subscription === 'Premium') {
        premium++;
      }
    });

    // Prepare the pie chart data
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

    setpieData(statusData);
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
          height: '600px',
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
          Apartments Subscriptions
        </Typography>
        <DataGrid
          rowsPerPageOptions={[10, 20, 50]}
          rows={apartment_details?.details || []}
          loading={isLoading || !apartment_details?.details}
          columns={columns}
          getRowId={(row) => `${row.apartment_id}-${row._id}`}
          sx={{
            height: '400px',
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
          height: '600px',
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
          Subscription Wheel
        </Typography>
        <AdminSubcheckpie data={pieData} />
      </Box>
    </Box>
  );
};

export default Subscriptions;
