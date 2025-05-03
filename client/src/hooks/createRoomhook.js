import { useNavigate } from 'react-router-dom';
import { useRazorpay } from "react-razorpay";
import axios from 'axios';
import env_variables from '../config/envconfig';
const useCreateRoom = () => {
    const { error, isLoading, Razorpay } = useRazorpay();
    const navigate = useNavigate();
    const roomHandler = async (roomData) => {
        try {
            const response = await axios.post('http://localhost:5000/payment/create-subscription', {
                sub_type: roomData.subscription
            }, {
                withCredentials: true,

            });
            const subscription = response.data;
            if (response.status === 200) {
                const options = {
                    key: env_variables.RAZORPAY_KEY_ID,
                    currency: 'INR',
                    name: 'Society Log',
                    description: 'create your room',
                    subscription_id: subscription.subscription.id,
                    prefill: {
                        name: roomData.name,
                        email: roomData.email,
                        contact: "+919500040431"
                    },
                    theme: {
                        color: '#F37254'
                    },
                    handler: async function () {
                        const formData = {
                            ...roomData,
                            subscriptionStatus: 'active',
                            subscriptionId: subscription.subscription.id
                        }
                        const addRoomData = await axios.post(
                            'http://localhost:5000/createRoom',
                            formData, {
                            withCredentials: true
                        }
                        );
                        if (addRoomData.status === 200) {
                            navigate('/dash');
                        }

                    }
                };
                if (error) throw Error(error.message);
                const razorpayInstance = new Razorpay(options);
                razorpayInstance.open();

            }

        } catch (error) {
            alert('Payment verification failed');
            navigate('/');
        }

    }
    return roomHandler;
}

export { useCreateRoom }
