import React from 'react';
import '../index.css';
import { NavLink } from 'react-router-dom';
import '@fontsource-variable/public-sans';
import { FaHandshake, FaHome } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
import { IoIosPricetag } from 'react-icons/io';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/slice/authSlice';
import { setUserDetails } from '../redux/slice/userSlice';
import { FaArrowRightLong } from 'react-icons/fa6';
import axios from 'axios';
import { RxHamburgerMenu } from 'react-icons/rx';
import { toggleSideBar } from '../redux/slice/SideDashSlice';
import src from '/logo.svg';
import { getRandomAnonymousName } from '../utils/AnonymousUtils';
import { Avatar, Tooltip } from '@mui/material';
import { toTitleCase } from '../utils/Roomutils';
function Header() {
  axios.defaults.withCredentials = true;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const randomName = getRandomAnonymousName();
  const isHamburger = useSelector((state) => state.sideDash.iconvisibility);
  const userdetails = useSelector((state) => state.user.userDetails);
  const Logout = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/user/logout`);
      if (response.status === 200) {
        dispatch(logout());
        dispatch(setUserDetails(null));
        navigate('/');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isLoggedIn = useSelector((state) => state.auth.status);

  return (
    <div className="fixed top-0 header z-50 border-style font-header font-normal bg-white shadow">
      <div className="left-header ml-6 flex items-center justify-center gap-3">
        <span
          className={`hover:bg-slate-300 rounded-[50%] cursor-pointer p-2 ${
            !isHamburger ? 'invisible' : ''
          }`}
          onClick={() => {
            dispatch(toggleSideBar());
          }}
        >
          <RxHamburgerMenu size={20} />
        </span>

        <NavLink to={'/'}>
          <span className="h-full flex items-center justify-center ml-0">
            <img
              src={src}
              alt="logo"
              className="object-cover"
              width={150}
              height={70}
            />
          </span>
        </NavLink>
      </div>
      <div className="right-header">
        <NavLink to={'/my-rooms'}>
          <div className="header-link">
            <span>
              <FaHome size={20} />
            </span>
            <p>My Abodes</p>
          </div>
        </NavLink>
        <NavLink to={'/create-room'}>
          <div className="header-link">
            <span>
              <FaHandshake size={20} />
            </span>
            <p>Join Us</p>
          </div>
        </NavLink>
        <NavLink to={'/dash'}>
          <div className="header-link">
            <span>
              <MdDashboard size={20} />
            </span>
            <p>DashBoard</p>
          </div>
        </NavLink>
        <NavLink to={'/pricing'}>
          <div className="header-link">
            <span>
              <IoIosPricetag size={20} />
            </span>
            <p>Pricing</p>
          </div>
        </NavLink>
        {isLoggedIn ? (
          <Tooltip
            title={toTitleCase(userdetails.username)}
            sx={{
              '&:hover': {
                cursor: 'pointer',
              },
            }}
          >
            <div className="user-avatar">
              <Avatar
                src={`https://api.dicebear.com/9.x/initials/svg?seed=${userdetails.username}&radius=50`}
                alt="User Avatar"
              />
            </div>
          </Tooltip>
        ) : (
          <Tooltip
            title={toTitleCase(randomName)}
            sx={{
              '&:hover': {
                cursor: 'pointer',
              },
            }}
          >
            <div className="user-avatar">
              <Avatar
                src={`https://api.dicebear.com/9.x/initials/svg?seed=${randomName}&radius=50`}
                alt="User Avatar"
              />
            </div>
          </Tooltip>
        )}

        {isLoggedIn ? (
          <div className="btn text-sm bg-slate-900 hover:bg-slate-800 text-white hover:cursor-pointer">
            <NavLink
              onClick={() => {
                Logout();
              }}
              className="flex gap-2 items-center justify-center"
            >
              Logout <FaArrowRightLong />
            </NavLink>
          </div>
        ) : (
          <div className="btn text-sm bg-slate-900 hover:bg-slate-800 text-white hover:cursor-pointer">
            <NavLink
              to={'/sign-in'}
              className="flex gap-2 items-center justify-center"
            >
              Login
              <FaArrowRightLong />
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
