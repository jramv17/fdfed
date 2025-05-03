import React from 'react';
import { Box, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { getApartmentDetails } from '../../../utils/DashBoardUtils';
import { useQuery } from '@tanstack/react-query';
import { toTitleCase } from '../../../utils/Roomutils';
import { Tag } from 'antd';
const ResidentApartments = () => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ['apartment_details'],
    queryFn: getApartmentDetails,
  });
  console.log(data);
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
    { field: 'subscription', headerName: 'Subscription', flex: 1 },
    {
      field: 'createdAt',
      headerName: 'Started At',
      flex: 1,
      renderCell: (params) => {
        const date = new Date(params.row.createdAt);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      },
    },
    { field: 'pincode', headerName: 'PinCode', flex: 1 },
  ];
  const additional_columns = [
    {
      field: 'apartment_name',
      headerName: 'Apartment Name',
      renderCell: (params) => {
        return toTitleCase(params.row.apartment_name);
      },
      flex: 1,
    },
    {
      field: 'resident_id',
      headerName: 'Number of Residents',
      renderCell: (params) => {
        if (!params.row.resident_id || !Array.isArray(params.row.resident_id)) {
          return 'No Residents';
        }
        return params.row.resident_id.length;
      },
      flex: 1,
    },
    {
      field: 'ownername',
      headerName: 'Owner Name',
      renderCell: (params) => {
        return toTitleCase(params.row.ownername);
      },
      flex: 1,
    },
    {
      field: 'username',
      headerName: 'Username',
      renderCell: (params) => {
        return toTitleCase(params.row.username);
      },
      flex: 1,
    },
    {
      field: 'flat_id',
      headerName: 'Flat ID',
      flex: 1,
    },
    {
      field: 'address',
      headerName: 'Address',
      renderCell: (params) => {
        return toTitleCase(params.row.address);
      },
      flex: 1,
    },
    {
      field: 'designation',
      headerName: 'Designation',
      flex: 1,
      renderCell: (params) => {
        let color = params.row.designation === 'Owner' ? 'red' : 'green';
        return (
          <Tag color={color} key={params.row.designation}>
            {params.row.designation?.toUpperCase()}
          </Tag>
        );
      },
    },
  ];

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
          Resident Apartments
        </Typography>
        <DataGrid
          rowsPerPageOptions={[10, 20, 50]}
          rows={data?.apartments || []}
          loading={isLoading || !data}
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
          Additional Informations
        </Typography>
        <DataGrid
          rowsPerPageOptions={[10, 20, 50]}
          rows={data?.apartments || []}
          loading={isLoading || !data}
          columns={additional_columns}
          getRowId={(row) => `${row.apartment_name}-${row.pincode}`}
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

export default ResidentApartments;
