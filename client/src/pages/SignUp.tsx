import React from 'react';
import SignUpForm from '../components/SignUpForm';
import videoUrl from '../../public/videoassest.mp4';


function SignUp() {
    return (
        <div className='relative w-full min-h-screen h-full'>
            <video src={videoUrl} className='w-full h-full object-cover' autoPlay loop muted></video>
            <div className="absolute inset-0 bg-black bg-opacity-10"></div>
            <div className='absolute inset-0 flex w-full min-h-screen items-center justify-end  opacity-90'>
                <SignUpForm />
            </div>
        </div>
    );
}

export default SignUp;
