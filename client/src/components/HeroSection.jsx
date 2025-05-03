import { useRef } from "react";

const Hero = () => {
  const comp = useRef(null);

  return (
    <div className="relative" ref={comp}>
      <div
        id="intro-slider"
        className="h-screen p-10 bg-gray-50 absolute top-0 left-0 font-spaceGrotesk z-10 w-full flex flex-col gap-10 tracking-tight"
      >
        <h1 className="text-9xl" id="title-1">
          Community.
        </h1>
        <h1 className="text-9xl" id="title-2">  
          Simplified.
        </h1>
        <h1 className="text-9xl" id="title-3">
          Effortless.
        </h1>
      </div>
      <div className="h-screen flex flex-col bg-gray-950 justify-center items-center">
        <h1
          id="welcome"
          className="text-9xl font-bold text-gray-100 font-spaceGrotesk"
        >
          Society Log
        </h1>
        <h2 id="tagline" className="text-3xl  text-gray-400 mt-4">
          "Making Apartment Life Less... Apartment-y!"
        </h2>
      </div>
    </div>
  );
};

export default Hero;
