import { HiUserCircle } from "react-icons/hi2";
import { TbHomeSearch } from "react-icons/tb";
import axios from 'axios';
import { MdOutlineSecurity } from "react-icons/md";
import { FaBox } from "react-icons/fa";
import { SlCalender } from "react-icons/sl"
import { TfiLayoutAccordionSeparated } from "react-icons/tfi";
import { getCreatedData } from "./Roomutils";
const DashBoardSideDashutils = [
    {
        "Personals": [
            {
                "name": "My Profile",
                "path": "/dashboard",
                "icon": HiUserCircle
            },
            {
                "name": "My Apartments",
                "path": "/dashboard/myapartments",
                "icon": TbHomeSearch
            }
        ],
        "Owner Announcements": [
            {
                "name": "Create Events",
                "path": "/dashboard/owner/createevents",
                "icon": SlCalender
            },
            {
                "name": "My Abodes",
                "path": "/dashboard/owners/myapartments",
                "icon": TfiLayoutAccordionSeparated
            }
        ],
        "Security Announcements": [
            {
                "name": "InOut Log",
                "path": "/dashboard/security-log",
                "icon": MdOutlineSecurity
            },
            {
                "name": "Parcel Log",
                "path": "/dashboard/parcel-log",
                "icon": FaBox
            }
        ],
    }
];
const getApartmentDetails = async () => {
    try {
        const response = await axios.get(`http://localhost:5000/dashboard/apartment_details`);
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
};

const UserDetailsforApartment = async () => {
    try {
        const response = await axios.get('http://localhost:5000/dashboard/user_apartment_details', {
            withCredentials: true
        });
        if (response.status === 200) {

            let severe = 0;
            let warning = 0;
            response.data.complaints.forEach((ele) => {
                if (ele.severity === 'warning') {
                    warning++;
                } else if (ele.severity === 'severe') {
                    severe++;
                }
            });
            const status = [
                {
                    id: 'severe',
                    label: 'Severe',
                    value: severe,
                    color: 'hsl(210, 70%, 50%)',
                },
                {
                    id: 'warning',
                    label: 'Warning',
                    value: warning,
                    color: 'hsl(350, 70%, 50%)',
                },
            ]
            return {
                status: status,
                complaints: response.data.complaints
            };
        }
    } catch (error) {
        console.log(error);
        return null;

    }
}


const Apartment_Complaints = async (apartment_id) => {
    try {
        const response = await axios.get(
            `http://localhost:5000/complaints/${apartment_id}`,
            { withCredentials: true }
        );
        console.log(response.data);
        let severe = 0;
        let warning = 0;
        severe = response.data.filter((ele) => ele.isSolved === true).length;
        warning = response.data.length - severe;
        return {
            status: [
                {
                    id: 'Solved',
                    label: 'Solved',
                    value: severe,
                    color: 'hsl(87, 70%, 50%)',
                },
                {
                    id: 'NotSolved',
                    label: 'NotSolved',
                    value: warning,
                    color: 'hsl(74, 70%, 50%)',
                }
            ]
            , complaints: response.data
        };
    } catch (error) {
        console.error('Could not fetch the complaints:', error);
        return null;

    }
}

const subscriptionDetails = async (subscription_id) => {
    try {
        const response = await axios.get(`http://localhost:5000/payment/get-subscription-details/${subscription_id}`, {
            withCredentials: true
        })
        return response.data;
    } catch (error) {
        console.error('Could not fetch the subscription details:', error);
        return null;

    }
}

const fetchAdminData = async () => {
    let basic = 0;
    let premium = 0;
    try {
        const response = await axios.get('http://localhost:5000/admin/details');
        if (response.status === 200) {
            const apartments_table = response.data.apartments?.map((ele) => {
                if (ele.subscription === 'Basic') {
                    basic++;
                } else {
                    premium++;
                }
                return {
                    apartment_name: ele.apartment_name,
                    ownername: ele.ownername,
                    address: ele.address,
                    subscription: ele.subscription,
                    no_of_residents: ele.resident_id.length,
                };
            });

            const users_table = response.data.users?.map((ele) => {
                return {
                    username: ele.username,
                    email: ele.email,
                    started_at: getCreatedData(ele.createdAt),
                    googleaccount: ele.isGoogleId ? 'Yes' : 'No',
                };
            });

            // Prepare pie chart data
            const statusData = [
                {
                    id: 'Basic',
                    label: 'Basic',
                    value: basic,
                    color: 'hsl(87, 70%, 50%)',
                },
                {
                    id: 'Premium',
                    label: 'Premium',
                    value: premium,
                    color: 'hsl(74, 70%, 50%)',
                },
            ];

            return { apartments_table, users_table, statusData };


        }
    } catch (error) {
        console.error(error);
        alert('Error in fetching details: ' + error.message);
    }
};

const SubscriptionDetails = async (apartment_id) => {
    try {
        const response = await axios.get(`http://localhost:5000/payment/get-subscription-details/${apartment_id}`, {
            withCredentials: true
        });
        return response.data.subscription;

    } catch (error) {
        console.error('Could not fetch the subscription details:', error);
        return null;

    }
}

const ApartmentUsers = async (apartment_id) => {
    try {

        const response = await axios.get(`http://localhost:5000/dashboard/apartment-users/${apartment_id}`, {
            withCredentials: true
        });
        console.log(response.data);
        const groupedData = response.data.residents.reduce((acc, ele) => {
            const day = ele.createdAt.slice(0, 10);

            if (acc[day]) {
                acc[day].value++;
            } else {
                acc[day] = { day, value: 1 };
            }

            return acc;
        }, {});
        const resultArray = Object.values(groupedData || {});
        return {
            data: response.data.residents,
            calenderData: resultArray
        };

    } catch (error) {
        console.error('Could not fetch the users:', error);
        return null;

    }
}

const switchSubscriptions = async (apartment_id, plan_id, subscription_id) => {
    try {
        const response = await axios.put('http://localhost:5000/payment/update-subscription', {
            apartment_id: apartment_id,
            plan_id: plan_id,
            subscription_id: subscription_id
        })
        if (response.status == 200) {
            return true;
        }
    } catch (error) {
        console.error('Could not switch subscriptions:', error);
        return false;

    }
}
const deleteSubscription = async (apartment_id, subscription_id) => {
    try {
        const response = await axios.delete(`http://localhost:5000/payment/cancel-subscription/${apartment_id}/${subscription_id}`)
        if (response.status == 200) {
            return true;
        }
    } catch (error) {
        console.error('Could not switch subscriptions:', error);
        return false;

    }
}

export { DashBoardSideDashutils, getApartmentDetails, UserDetailsforApartment, Apartment_Complaints, fetchAdminData, SubscriptionDetails, ApartmentUsers, deleteSubscription, switchSubscriptions };
