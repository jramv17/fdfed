import React from 'react'
import SignInForm from '../components/SignInForm'
import videoUrl from '/videoassest.mp4';

function SignIn() {
    return (
        <div className='relative w-full min-h-screen'>
            <video src={videoUrl} className='w-full h-full object-cover' autoPlay loop muted></video>
            <div className="absolute inset-0 bg-black bg-opacity-10"></div>
            <div className='absolute inset-0 flex w-full min-h-screen items-center justify-end  opacity-90'>
                <SignInForm />
            </div>
        </div>
    )
}

export default SignIn
