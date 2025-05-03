import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import CreateApartmentRoom from './pages/CreateApartmentRoom';
import Home from './pages/Home';
import Layout from './components/Layout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChatPage from './pages/ChatPage';
import AuthLayout from './components/AuthLayout';
import axios from 'axios';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import usegetJwtVerify from './hooks/jwtVerify';
import DashBoard from './pages/DashBoard';
import Pricing from './pages/Pricing';
import MyRooms from './pages/MyRooms';
import Room from './pages/Room';
import Error from './pages/Error';
import ComplaintDisplay from './pages/ComplaintDisplay';
import AdminDisplay from './pages/AdminDisplay';
import QueryProvider from './components/providers/ReactQueryProvider';
import DashBoardLayout from './components/DashBoardLayout';
import { CssBaseline } from '@mui/material';
import ResidentApartments from './components/DashBoard/Resident/ResidentApartments';
import UserComplaints from './components/DashBoard/Resident/UserDashBoardComplaints';
import OwningApartments from './components/DashBoard/Owner/OwningApartments';
import ApartmentDashBoardDetails from './components/DashBoard/Owner/ApartmentDashBoardDetails';
import Subscriptions from './components/DashBoard/Owner/AllSubscriptions';
import AddLogDashBoard from './components/DashBoard/Security/AddLogDashBoard';
import AddParcelDashBoard from './components/DashBoard/Security/AddParcelDashBoard';
import AdminApartmentsDetails from './components/DashBoard/Admin/AdminApartmentsDetails';
import AdminLayout from './components/DashBoard/Admin/AdminLayout';
import CommunityPostsPage from './components/CommunityPostsPage';
import ApartmentSubscription from './components/DashBoard/Owner/ApartmentSubscription';

gsap.registerPlugin(ScrollTrigger);

function App() {
  axios.defaults.withCredentials = true;
  const jwtVerify = usegetJwtVerify();
  jwtVerify();
  axios.defaults.withCredentials = true;

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <AuthLayout authentication={false}>
              <Home />
            </AuthLayout>
          }
        />
        <Route
          path="sign-in"
          element={
            <AuthLayout authentication={false}>
              <SignIn />
            </AuthLayout>
          }
        />
        <Route
          path="sign-up"
          element={
            <AuthLayout authentication={false}>
              <SignUp />
            </AuthLayout>
          }
        />
        <Route
          path="create-room"
          element={
            <AuthLayout authentication={true}>
              <CreateApartmentRoom />
            </AuthLayout>
          }
        />
        <Route
          path="/:apartment_id/complaints/list"
          element={
            <AuthLayout authentication={true}>
              <ComplaintDisplay />
            </AuthLayout>
          }
        />
        <Route
          path="my-rooms"
          element={
            <AuthLayout authentication={true}>
              <MyRooms />
            </AuthLayout>
          }
        />
        <Route
          path="admin/dashboard"
          element={
            <AuthLayout authentication={true}>
              <AdminDisplay />
            </AuthLayout>
          }
        />
        <Route
          path="dashboard"
          element={
            <AuthLayout authentication={true}>
              <DashBoard />
            </AuthLayout>
          }
        />

        <Route
          path="dash/complaints"
          element={
            <AuthLayout authentication={true}>
              <DashBoardLayout>
                <UserComplaints />
              </DashBoardLayout>
            </AuthLayout>
          }
        />
        <Route
          path="dash/admin/apartments"
          element={
            <AuthLayout authentication={true}>
              <DashBoardLayout>
                <AdminLayout>
                  <AdminApartmentsDetails />
                </AdminLayout>
              </DashBoardLayout>
            </AuthLayout>
          }
        />
        <Route
          path="dash/logs"
          element={
            <AuthLayout authentication={true}>
              <DashBoardLayout>
                <AddLogDashBoard />
              </DashBoardLayout>
            </AuthLayout>
          }
        />

        <Route
          path="dash/parcels"
          element={
            <AuthLayout authentication={true}>
              <DashBoardLayout>
                <AddParcelDashBoard />
              </DashBoardLayout>
            </AuthLayout>
          }
        />
        <Route
          path="dash/apartment/:apartment_id"
          element={
            <AuthLayout authentication={true}>
              <DashBoardLayout>
                <ApartmentDashBoardDetails />
              </DashBoardLayout>
            </AuthLayout>
          }
        />
        <Route
          path="dash/owningapartments"
          element={
            <AuthLayout authentication={true}>
              <DashBoardLayout>
                <OwningApartments />
              </DashBoardLayout>
            </AuthLayout>
          }
        />
        <Route
          path="dash/subscriptions"
          element={
            <AuthLayout authentication={true}>
              <DashBoardLayout>
                <Subscriptions />
              </DashBoardLayout>
            </AuthLayout>
          }
        />

        <Route
          path="dash/apartment/subscription/:apartment_id"
          element={
            <AuthLayout authentication={true}>
              <DashBoardLayout>
                <ApartmentSubscription />
              </DashBoardLayout>
            </AuthLayout>
          }
        />

        <Route
          path="dash"
          element={
            <AuthLayout authentication={true}>
              <DashBoardLayout>
                <ResidentApartments />
              </DashBoardLayout>
            </AuthLayout>
          }
        />

        <Route
          path="dashboard/myprofile"
          element={
            <AuthLayout authentication={true}>
              <DashBoard />
            </AuthLayout>
          }
        />
        <Route
          path="dashboard/owner/createevents"
          element={
            <AuthLayout authentication={true}>
              <DashBoard />
            </AuthLayout>
          }
        />
        <Route
          path="dashboard/myapartments"
          element={
            <AuthLayout authentication={true}>
              <DashBoard />
            </AuthLayout>
          }
        />
        <Route
          path="dashboard/security-log"
          element={
            <AuthLayout authentication={true}>
              <DashBoard />
            </AuthLayout>
          }
        />
        <Route
          path="dashboard/parcel-log"
          element={
            <AuthLayout authentication={true}>
              <DashBoard />
            </AuthLayout>
          }
        />
        <Route
          path="pricing"
          element={
            <AuthLayout authentication={false}>
              <Pricing />
            </AuthLayout>
          }
        />
        <Route
          path="room/:apartment_id/log"
          element={
            <AuthLayout authentication={true}>
              <Room />
            </AuthLayout>
          }
        />
        <Route
          path="room/:apartment_id/chat"
          element={
            <AuthLayout authentication={true}>
              <ChatPage />
            </AuthLayout>
          }
        />
        <Route
          path="room/:apartment_id/details"
          element={
            <AuthLayout authentication={true}>
              <Room />
            </AuthLayout>
          }
        />
        <Route
          path="room/:apartment_id/parcel"
          element={
            <AuthLayout authentication={true}>
              <Room />
            </AuthLayout>
          }
        />
        <Route
          path="room/:apartment_id/complaints"
          element={
            <AuthLayout authentication={true}>
              <Room />
            </AuthLayout>
          }
        />
        <Route
          path="room/:apartment_id"
          element={
            <AuthLayout authentication={true}>
              <Room />
            </AuthLayout>
          }
        />
        <Route
          path="profile/:username"
          element={
            <AuthLayout authentication={true}>
              <Room />
            </AuthLayout>
          }
        />

        <Route
          path="room/:apartment_id/posts"
          element={
            <AuthLayout authentication={true}>
              <CommunityPostsPage />
            </AuthLayout>
          }
        />
        {/* Catch-all route for undefined paths */}
        <Route
          path="*"
          element={
            <AuthLayout authentication={false}>
              <Error /> {/* Or create a 404 page */}
            </AuthLayout>
          }
        />
      </Route>
    )
  );

  return (
    <QueryProvider>
      <CssBaseline />

      <RouterProvider router={router} />
    </QueryProvider>
  );
}

export default App;
