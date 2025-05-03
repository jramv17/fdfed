import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login, logout } from '../redux/slice/authSlice';
import { setUserDetails } from '../redux/slice/userSlice';
const UsegetJwtVerify = () => {
    const dispatch = useDispatch();

    const jwtVerify = async () => {
        axios.defaults.withCredentials = true;
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
        }
    }
    return jwtVerify;
}

export default UsegetJwtVerify;