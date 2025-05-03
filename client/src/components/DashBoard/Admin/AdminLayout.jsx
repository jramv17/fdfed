import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';
const AdminLayout = ({ children }) => {
  const email = useSelector((state) => state.user.userDetails.email);
  if (email === 'adminsl@gmail.com') {
    return children;
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        padding: '1rem',
        borderRadius: '0.5rem',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Typography variant="h4">
        You are not authorized to view this page.
      </Typography>
      <Typography variant="h5">
        Please contact adminsl@gmail.com to access.
      </Typography>
    </Box>
  );
};

export default AdminLayout;
