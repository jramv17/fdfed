import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import {
  Apartment_Complaints,
  ApartmentUsers,
} from '../../../utils/DashBoardUtils';
import { toTitleCase } from '../../../utils/Roomutils';
import { Tag } from 'antd';
import { DataGrid } from '@mui/x-data-grid';
import MyResponsiveCalendar from '../../nivocharts/CalenderUi';
import { ApartmentComplaintsPie } from '../../nivocharts/PieChart';
const ApartmentDashBoardDetails = () => {
  const columns = [
    {
      field: 'complaintTitle',
      headerName: 'Title',
      flex: 0.8,
      renderCell: (params) => {
        return toTitleCase(params.row.complaintTitle);
      },
    },
    {
      field: 'complaintDetail',
      headerName: 'Description',
      flex: 1,
      renderCell: (params) => {
        return params.row.description;
      },
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      flex: 0.8,
      renderCell: (params) => {
        const date = new Date(params.row.createdAt);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      },
    },
    {
      field: 'complaintType',
      headerName: 'Type',
      flex: 0.5,
    },
    {
      field: 'isSolved',
      headerName: 'Status',
      flex: 0.5,
      renderCell: (params) => {
        const color = params.row.isSolved ? 'green' : 'red';
        return (
          <Tag color={color} key={params.row._id}>
            {params.row.isSolved ? 'Solved' : 'NotSolved'}
          </Tag>
        );
      },
    },
    {
      field: 'flat_id',
      headerName: 'Flat ID',
      flex: 0.5,
    },
  ];
  const { apartment_id } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['apartment_complaints', apartment_id],
    queryFn: () => Apartment_Complaints(apartment_id),
    enabled: !!apartment_id,
  });
  console.log(data?.status);
  const {
    data: apartment_users,
    isLoading: Loading,
    isError: error,
  } = useQuery({
    queryKey: ['apartment_users', apartment_id],
    queryFn: () => ApartmentUsers(apartment_id),
    enabled: !!apartment_id,
  });
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
        <Typography
          width={'100%'}
          textAlign={'left'}
          component={'h1'}
          variant="h4"
          fontWeight={'bold'}
          sx={{ mb: '1rem' }}
        >
          Residents Calender
        </Typography>
        {apartment_users?.calenderData && (
          <MyResponsiveCalendar data={apartment_users?.calenderData} />
        )}
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
          Complaints Filed By The Residents
        </Typography>
        <DataGrid
          rowsPerPageOptions={[10, 20, 50]}
          rows={data?.complaints || []}
          loading={isLoading || !data.complaints}
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
          height: '300px',
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
        {data?.status && <ApartmentComplaintsPie data={data?.status} />}
      </Box>
    </Box>
  );
};

export default ApartmentDashBoardDetails;
