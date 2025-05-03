import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { login, logout } from '../redux/slice/authSlice';
import { setUserDetails } from '../redux/slice/userSlice';
import { setApartmentDetails } from '../redux/slice/userSlice';
function AuthLayout({ children, authentication = true }) {
  const [loader, setLoader] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const isRoot = location.pathname === '/';
  const isAuthPage =
    location.pathname === '/sign-in' || location.pathname === '/sign-up';
  const isVerify = useSelector((state) => state.auth.status);
  const isGoogleId = useSelector((state) => state.auth.isGoogleid);
  useEffect(() => {
    axios.defaults.withCredentials = true;

    const verifyToken = async () => {
      if (isRoot && isGoogleId && !isVerify) {
        try {
          const response = await axios.get(`http://localhost:5000/jwtVerify`);
          if (response.status == 200) {
            dispatch(login());
            dispatch(setUserDetails(response.data));
          } else {
            dispatch(logout());
            dispatch(setUserDetails(null));
          }
        } catch (error) {
          dispatch(logout());
          dispatch(setUserDetails(null));
          navigate('/sign-in');
        } finally {
          setLoader(false);
        }
      }
      if (isAuthPage && isVerify) {
        navigate('/');
      }

      if (!authentication) {
        setLoader(false);
        return;
      } else if (isVerify) {
        setLoader(false);
        return;
      } else {
        navigate('/sign-in');
      }
    };

    verifyToken();
  }, [authentication, navigate, location]);

  return loader ? <div>Loading...</div> : <>{children}</>;
}

export default AuthLayout;
