// FeaturesSection.js
import { useRef } from "react";
import { FaComments, FaBullhorn, FaTools, FaBox } from "react-icons/fa";

const Features = () => {
  return (
    <div className="relative">
      {/* Main Features Section */}
      <div className="h-screen p-10 bg-white flex flex-col justify-center items-center z-10 w-full gap-12 tracking-tight">
        <br />
        <h2 className="text-7xl font-bold font-spaceGrotesk text-black mb-10">
          Features that Matter
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12 w-full">
          {/* Chatroom Feature */}
          <div className="feature-card p-6 bg-gray-950 shadow-lg rounded-lg hover:shadow-2xl transition duration-300">
            <div className="icon text-6xl mb-4 text-white">
              <FaComments />
            </div>
            <h3 className="text-4xl font-semibold text-white mb-2">Chatroom</h3>
            <p className="text-lg text-gray-300">
              Engage with residents instantly using real-time chat. Stay connected and never miss out on important discussions within your community.
            </p>
          </div>

          {/* Announcements Feature */}
          <div className="feature-card p-6 bg-gray-950 shadow-lg rounded-lg hover:shadow-2xl transition duration-300">
            <div className="icon text-6xl mb-4 text-white">
              <FaBullhorn />
            </div>
            <h3 className="text-4xl font-semibold text-white mb-2">Announcements</h3>
            <p className="text-lg text-gray-300">
              Stay informed with real-time announcements from the management. From maintenance updates to community events, never miss a beat.
            </p>
          </div>

          {/* Complaints & Queries Feature */}
          <div className="feature-card p-6 bg-gray-950 shadow-lg rounded-lg hover:shadow-2xl transition duration-300">
            <div className="icon text-6xl mb-4 text-white">
              <FaTools />
            </div>
            <h3 className="text-4xl font-semibold text-white mb-2">Complaints & Queries</h3>
            <p className="text-lg text-gray-300">
              Facing an issue? Raise complaints and queries easily, and receive prompt resolutions from the management. Your concerns, addressed swiftly.
            </p>
          </div>

          {/* Logging & Delivery Feature */}
          <div className="feature-card p-6 bg-gray-950 shadow-lg rounded-lg hover:shadow-2xl transition duration-300">
            <div className="icon text-6xl mb-4 text-white">
              <FaBox />
            </div>
            <h3 className="text-4xl font-semibold text-white mb-2">Logging & Delivery</h3>
            <p className="text-lg text-gray-300">
              Track entry logs and deliveries with ease. Ensure a secure flow of people and packages in and out of the apartment complex.
            </p>
          </div>
          <br />
        </div>
      </div>
      
      {/* Call to Action Section */}
      <div className="h-screen flex bg-gray-950 justify-center items-center">
        <h1 id="cta" className="text-7xl font-bold text-white font-spaceGrotesk">
          Experience a New <span id="era" className="text-white">Era</span>.
        </h1>
      </div>
    </div>
  );
};

export default Features;
