import React from 'react';
import CreateRoomForm from '../components/CreateRoomForm';
import { Carousel, RightBar } from '../components/CreateRoomComponents';
import { GiTakeMyMoney, GiSecurityGate } from 'react-icons/gi';

function CreateApartmentRoom() {
  return (
    <div className="flex flex-col items-center mt-10 px-4 sm:px-8 lg:px-16 gap-8">
      {/* Header Section */}
      <div className="flex flex-col items-center justify-center text-center gap-2">
        <h1 className="text-5xl font-bold text-red-800 tracking-tight">
          Elevate Your Living Experience
        </h1>
        <p className="text-2xl text-gray-800 italic">
          Where comfort meets convenience
        </p>
      </div>

      {/* Form and Sidebar Side by Side */}
      <div className="flex justify-between items-start mt-7 w-full max-w-screen-xl gap-12">
        <div className="flex-1">
          <CreateRoomForm />
        </div>
        <div className="flex-none mt-7 w-1/3">
          <RightBar />
        </div>
      </div>

      {/* Carousel Section */}
      <div className="w-full max-w-screen-xl mt-4">
        <Carousel />
      </div>

      {/* Know Our Features Section */}
      <div className="w-full mt-10 flex flex-col items-center">
        <h3 className="text-4xl font-bold tracking-wide text-gray-800 mb-8">
          Know Our Features
        </h3>
        <div className="flex flex-wrap gap-12 justify-center items-center">
          {/* Feature 1 */}
          <div className="flex flex-col items-center">
            <GiTakeMyMoney size={60} className="text-gray-700" />
            <span className="text-xl mt-4 text-gray-700 font-semibold">
              Integrated Payment Gateway
            </span>
          </div>
          {/* Feature 2 */}
          <div className="flex flex-col items-center">
            <GiSecurityGate size={60} className="text-gray-700" />
            <span className="text-xl mt-4 text-gray-700 font-semibold">
              Instant Responses for Problems
            </span>
          </div>
          {/* Feature 3 */}
          <div className="flex flex-col items-center">
            <GiTakeMyMoney size={60} className="text-gray-700" />
            <span className="text-xl mt-4 text-gray-700 font-semibold">
              Rent Payment Integration
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateApartmentRoom;
