import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import '@fontsource/poppins';
import { useDispatch } from 'react-redux';
import { toggleIconVisibility } from '../redux/slice/SideDashSlice';
import { useEffect } from 'react';
import { setDataReset } from '../redux/slice/userSlice';

const footerRoutes = [/^\/my-rooms(\/.*)?$/, /^\/room\/[^/]+$/];

const Layout = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const shouldHideFooter = footerRoutes.some((pattern) =>
    pattern.test(location.pathname)
  );

  useEffect(() => {
    const isChatPage = location.pathname.endsWith('/chat');
    if (!isChatPage) {
      dispatch(setDataReset());
    }
    dispatch(toggleIconVisibility(shouldHideFooter));
  }, [shouldHideFooter, dispatch, location.pathname]);

  const isAuth =
    location.pathname === '/sign-in' || location.pathname === '/sign-up';

  return (
    <div className="flex flex-col min-h-screen font-content">
      {!isAuth && <Header />}

      <div className={`flex-grow ${!isAuth ? 'mt-[73px]' : ''}`}>
        <Outlet />
      </div>

      {!isAuth && !shouldHideFooter && <Footer />}
    </div>
  );
};

export default Layout;
