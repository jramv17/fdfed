import React, { useEffect, useState } from 'react';
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  MdChevronLeft,
  MdApartment,
  MdWrongLocation,
  MdLeaderboard,
  MdAdminPanelSettings,
  MdSubscriptions,
} from 'react-icons/md';
import { useTheme } from '@mui/material/styles';
import { CiLogin } from 'react-icons/ci';
import { FaBox } from 'react-icons/fa';
const navItems = [
  {
    text: 'Resident',
    icon: null,
  },
  {
    text: 'My Apartments',
    icon: <MdApartment />,
    path: '/dash',
  },
  {
    text: 'Complaints',
    icon: <MdWrongLocation />,
    path: '/dash/complaints',
  },
  {
    text: 'Owner',
    icon: null,
  },
  {
    text: 'Own Apartments',
    icon: <MdLeaderboard />,
    path: '/dash/owningapartments',
  },
  {
    text: 'Subsciptions',
    icon: <MdSubscriptions />,
    path: '/dash/subscriptions',
  },
  {
    text: 'Security',
    icon: null,
  },
  {
    text: 'Add Log',
    icon: <CiLogin />,
    path: '/dash/logs',
  },
  {
    text: 'Add Parcel',
    icon: <FaBox />,
    path: '/dash/parcels',
  },
  {
    text: 'Admin',
    icon: null,
  },
  {
    text: 'Apartments',
    icon: <MdAdminPanelSettings />,
    path: '/dash/admin/apartments',
  },
];

const SideBar = ({ drawerWidth }) => {
  const [active, setActive] = useState('');
  const navigate = useNavigate();
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const { pathname } = useLocation();
  const theme = useTheme();
  const location = useLocation();
  useEffect(() => {
    setActive(pathname);
  }, [pathname]);

  return (
    <Box
      sx={{
        width: drawerWidth,
        height: '100%',
        flexShrink: 0,
        borderRight: '0.8px solid gray',
        position: 'fixed',
        zIndex: 1000,
        overflowY: 'auto',
        boxShadow:
          '0 4px 8px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.06)', // Neat shadow
      }}
    >
      <Box
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            color: theme.palette.text.primary,
          },
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        {/* Drawer Items */}
        <List>
          {navItems.map(({ text, icon, path }) => {
            if (!icon) {
              return (
                <Typography key={text} sx={{ m: '2.25rem 0 0rem 3rem' }}>
                  {text}
                </Typography>
              );
            }
            const lcText = text.toLowerCase();

            return (
              <ListItem key={text} disablePadding>
                <ListItemButton
                  onClick={() => {
                    navigate(path);
                    setActive(lcText);
                  }}
                  sx={{
                    backgroundColor:
                      location.pathname === path
                        ? theme.palette.secondary[300]
                        : 'transparent',
                    color:
                      location.pathname === path
                        ? theme.palette.primary[600]
                        : theme.palette.secondary[100],
                  }}
                >
                  <ListItemIcon
                    sx={{
                      ml: '2rem',
                      color: '#00f',
                    }}
                  >
                    {icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={text}
                    sx={{
                      textWrap: 'nowrap',
                    }}
                  />
                  {active === lcText && <MdChevronLeft sx={{ ml: 'auto' }} />}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Box>
  );
};

export default SideBar;
