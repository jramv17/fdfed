import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { UserDetailsforApartment } from '../../../utils/DashBoardUtils';
import { useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';
import { UserComplaintsPie } from '../../nivocharts/PieChart';
import { DataGrid } from '@mui/x-data-grid';
import { MyResponsiveBar } from '../../nivocharts/BarChart';
import { format } from 'date-fns';
import { Tag } from 'antd';
import { toTitleCase } from '../../../utils/Roomutils';
const UserComplaints = () => {
  const { username } = useSelector((state) => state.user.userDetails);
  const columns = [
    {
      field: 'complaints',
      headerName: 'Complaints',
      renderCell: (params) => {
        return toTitleCase(params.row.complaints);
      },
      flex: 1,
    },
    {
      field: 'createdAt',
      headerName: 'Started At',
      flex: 0.5,
      renderCell: (params) => {
        const date = new Date(params.row.createdAt);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      },
    },
    {
      field: 'severity',
      headerName: 'Severity',
      flex: 0.5,
      renderCell: (params) => {
        let color = params.row.designation === 'severe' ? 'red' : 'green';
        return (
          <Tag color={color} key={params.row.severity}>
            {params.row.severity?.toUpperCase()}
          </Tag>
        );
      },
    },
  ];
  const {
    data: user_details,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['apartment_details', username],
    queryFn: UserDetailsforApartment,
  });
  useEffect(() => {
    let severe = 0;
    let warning = 0;

    if (user_details && user_details.length > 0) {
      user_details.forEach((ele) => {
        if (ele.severity === 'warning') {
          warning++;
          monthlyData[month].warning++;
        } else if (ele.severity === 'severe') {
          severe++;
        }
      });

      setPieData();
    }
  }, [user_details]);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!user_details) {
    return <div>User not found.</div>;
  }
  return (
    <Box
      sx={{
        width: '100%',
        height: '600px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        gap: '1rem',
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
        Details and BreakDown
      </Typography>
      <Box
        sx={{
          width: '100%',
          height: '50%',
          borderRadius: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <Box
          sx={{
            backgroundColor: '#ffffff',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
            transition: 'box-shadow 0.3s ease, transform 0.3s ease',
            '&:hover': {
              boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.3)',
              transform: 'translateY(-4px)',
            },
            display: 'flex',
            width: '30%',
            height: '400px',
            padding: '0.5rem',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '0.5rem',
            gap: '1rem',
          }}
        >
          <UserComplaintsPie data={user_details.status} />
          <Typography
            width={'100%'}
            textAlign={'left'}
            component={'h1'}
            variant="p"
            WordWrap={false}
          >
            Breakdown Of Complaints Based On Severity
          </Typography>
        </Box>
        <DataGrid
          rowsPerPageOptions={[10, 20, 50]}
          rows={user_details?.complaints || []}
          loading={isLoading || !user_details.complaints}
          columns={columns}
          getRowId={(row) => `${row.complaints}-${row.createdAt}`}
          sx={{
            height: '400px',
            width: '60%',
            bgcolor: 'background.paper',
          }}
        />
      </Box>
    </Box>
  );
};

export default UserComplaints;
