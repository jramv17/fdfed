import React, { useEffect, useState } from 'react';
import { useSpring, animated } from 'react-spring';
import { carousel } from '../utils/Staticassests';
import '../index.css';
import { RiRadioButtonLine } from 'react-icons/ri';
import { IoIosRadioButtonOff } from 'react-icons/io';

const rightbarData = [
  {
    title: 'Engagement',
    text: 'Engage with your neighbors through our platform. Post updates, ask questions, and receive quick responses to foster a friendly environment.',
    src: 'assest6.png',
  },
  {
    title: 'Assistance',
    text: 'Have a concern? Report it directly through our interface, and get timely assistance from your community managers.',
    src: 'assest4.png',
  },
  {
    title: 'Coordination',
    text: 'Stay updated about community events and easily organize your own. Our platform helps you create, promote, and manage local gatherings.',
    src: 'assest1.png',
  },
];

function RightBar() {
  return (
    <div className="grid grid-cols-1 gap-7 place-items-center justify-center w-fit">
      <div className="flex w-full items-center justify-center">
        <div className="text-4xl font-bold text-gray-800">Why Us?</div>
      </div>
      <div className="flex flex-col gap-9">
        {rightbarData.map((element, index) => (
          <div key={index} className="flex flex-col items-center gap-4">
            <div className="flex gap-4 items-center">
              <div className="w-1/3 h-64 max-w-sm flex-shrink-0">
                <img
                  src={element.src}
                  alt="image"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="flex flex-col gap-4">
                <div className="text-2xl font-semibold text-gray-700">
                  {element.title}
                </div>
                <div className="text-base text-gray-600 max-w-md">
                  {element.text}
                </div>
              </div>
            </div>
            <hr className="w-full border-gray-300 mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}

function Carousel() {
  const [index, setIndex] = useState(0);

  const props = useSpring({
    transform: `translateX(${index * -100}%)`,
    config: { mass: 10, tension: 500, friction: 80 },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((index) => (index === carousel.length - 1 ? 0 : index + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center mt-4">
      <div className="max-w-[1200px] h-[400px] flex items-center flex-col justify-center space-y-4">
        <div className="card shadow-lg rounded-lg w-full h-full mx-auto">
          <div className="carousel-container w-full h-full overflow-hidden rounded-lg">
            <div className="carousel-slide flex" style={{ width: '100%' }}>
              <animated.div
                style={props}
                className="carousel-track flex w-full"
              >
                {carousel.map((image, i) => (
                  <div
                    key={i}
                    className={`carousel-item w-full h-full relative flex-shrink-0 ${
                      index === i ? 'active' : 'inactive'
                    }`}
                  >
                    <img
                      src={image.src}
                      alt={`Slide ${i}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute bottom-0 flex items-center justify-center text-white bg-black bg-opacity-50 px-4 py-2 rounded-lg">
                      {image.text}
                    </div>
                  </div>
                ))}
              </animated.div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center space-x-2 w-full h-full">
          {carousel.map((_, i) => (
            <span key={i} className="text-xl text-gray-600">
              {index === i ? <RiRadioButtonLine /> : <IoIosRadioButtonOff />}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export { RightBar, Carousel };
