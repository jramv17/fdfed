import { FaPlus } from 'react-icons/fa';

import axios from 'axios';
import { AiOutlineConsoleSql } from 'react-icons/ai';

const backgroundColors = [
    {
        color: 'linear-gradient(90deg, hsla(40, 63%, 85%, 1) 0%, hsla(22, 94%, 79%, 1) 100%)',
        shadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    {
        color: 'hsla(186, 33%, 94%, 1)',
        shadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    {
        color: 'linear-gradient(90deg, hsla(186, 33%, 94%, 1) 0%, hsla(216, 41%, 79%, 1) 100%)',
        shadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    {
        color: 'linear-gradient(90deg, hsla(298, 68%, 90%, 1) 0%, hsla(30, 82%, 91%, 1) 100%)',
        shadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    {
        color: 'linear-gradient(90deg, hsla(332, 53%, 82%, 1) 0%, hsla(176, 57%, 89%, 1) 100%)',
        shadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    {
        color: 'linear-gradient(90deg, hsla(311, 74%, 87%, 1) 0%, hsla(275, 19%, 88%, 1) 100%)',
        shadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    }
];
const getCreatedData = (date) => {
    const dateObj = new Date(date);

    if (isNaN(dateObj.getTime())) {
        return 'Invalid Date';
    }

    const options = { year: 'numeric', month: 'long', day: 'numeric' };

    return dateObj.toLocaleDateString('en-GB', options);
};
const toTitleCase = (str) => {
    if (!str) {
        return '';
    }
    return str
        .trim()
        .replace(/\s+/g, ' ')
        .split(' ')
        .map(word =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(' ');
};
const getApartmentId = (apartment_id) => {

    return `${apartment_id.slice(0, 7)}...${apartment_id.slice(-7)}`;
}
const fetchRoomData = async () => {
    axios.defaults.withCredentials = true;
    try {
        const response = await axios.get('http://localhost:5000/my-rooms');
        if (response.status === 200) {
            return {
                status: 'data is empty',
                rooms: []
            };
        } else if (response.status === 201) {
            return {
                status: 'data fetched',
                rooms: response.data
            };
        }
    } catch (error) {
        return {
            status: 'error occurred',
            rooms: []
        }
    }
};
const fetchData = async (apartment_id) => {
    try {
        const response = await axios.get(
            `http://localhost:5000/room-details/${apartment_id}`
        );
        const { data } = response;
        if (response.status === 200) {
            return data;

        }
    } catch (error) {
        return null
    }
};

const fetchisRole = async (role) => {
    try {
        const response = await axios.get(`http://localhost:5000/isSuperRole/${role}`, {
            withCredentials: true
        });
        const { data } = response;

        return data;
    } catch (error) {
        console.log(error);
        return null;

    }

}


const fetchRoomDetails = async (apartment_id) => {
    try {
        const response = await axios.get(
            `http://localhost:5000/room-details/${apartment_id}/details`
        );
        const { data } = response;
        if (response.status === 200) {
            return response.data;

        }
    } catch (error) {
        return null;

    }
}


export { backgroundColors, getApartmentId, getCreatedData, toTitleCase, fetchRoomData, fetchData, fetchRoomDetails, fetchisRole };
