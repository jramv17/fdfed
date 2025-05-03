import React from 'react';
import { Box, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { fetchAdminData } from '../../../utils/DashBoardUtils';
import { DataGrid } from '@mui/x-data-grid';
import { Tag } from 'antd';
import { AdminSubcheckpie } from '../../nivocharts/PieChart';
import { useSelector } from 'react-redux';
const AdminApartmentsDetails = () => {
  const apartment_columns = [
    { field: 'apartment_name', headerName: 'Apartment Name', flex: 0.5 },
    {
      field: 'createdAt',
      headerName: 'Created At',
      flex: 0.5,
      renderCell: (params) => {
        return new Date(params.row.createdAt).toLocaleString();
      },
    },
    { field: 'ownername', headerName: 'Owner', flex: 0.5 },
    {
      field: 'no_of_residents',
      headerName: 'No of Residents',
      flex: 0.5,
    },
    {
      field: 'subscription',
      headerName: 'Subscription',
      flex: 0.5,
      renderCell: (params) => {
        return <Tag color="blue">{params.row.subscription}</Tag>;
      },
    },
    { field: 'address', headerName: 'Address', flex: 1 },
  ];

  const user_columns = [
    {
      field: 'username',
      headerName: 'Name',
      flex: 0.5,
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 0.5,
    },
    {
      field: 'googleaccount',
      headerName: 'Google Account',
      flex: 0.5,
    },
    {
      field: 'started_at',
      headerName: 'Created Account On',
      flex: 0.5,
    },
  ];
  const { data, isError, isLoading } = useQuery({
    queryKey: ['admin_details'],
    queryFn: fetchAdminData,
  });
  if (isError) {
    return (
      <Box>
        <Typography>Error fetching data, please try again later.</Typography>
      </Box>
    );
  }
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
          sx={{ mb: '1rem' }} // Added margin-bottom for spacing
        >
          Apartments Details
        </Typography>
        <DataGrid
          rowsPerPageOptions={[10, 20, 50]}
          rows={data?.apartments_table || []}
          loading={isLoading || !data}
          columns={apartment_columns}
          getRowId={(row) => `${row.apartment_name}`}
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
          height: '400px',
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
        {!isLoading && !isError && data?.statusData && (
          <AdminSubcheckpie data={data?.statusData} />
        )}
      </Box>
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
          sx={{ mb: '1rem' }} // Added margin-bottom for spacing
        >
          User Information
        </Typography>
        <DataGrid
          rowsPerPageOptions={[10, 20, 50]}
          rows={data?.users_table || []}
          loading={isLoading || !data}
          columns={user_columns}
          getRowId={(row) => `${row.email}-${row.username}`}
          sx={{
            height: '600px',
            width: '100%',
            bgcolor: 'background.paper',
          }}
        />
      </Box>
    </Box>
  );
};

export default AdminApartmentsDetails;
