import React from 'react';
import gsap from 'gsap';

const HowItWorksSection = () => {
  return (
    <section className="how-it-works-section py-20 bg-white text-center">
      <h2 className="text-3xl font-semibold mb-10">How It Works</h2>
      <div className="max-w-4xl mx-auto">
        <div className="step bg-gray-100 p-6 shadow-md mb-6">
          <h3 className="text-2xl font-bold mb-4">Step 1</h3>
          <p>Log in to your account.</p>
        </div>
        <div className="step bg-gray-100 p-6 shadow-md mb-6">
          <h3 className="text-2xl font-bold mb-4">Step 2</h3>
          <p>Choose the service you need – chat, complaints, or announcements.</p>
        </div>
        <div className="step bg-gray-100 p-6 shadow-md">
          <h3 className="text-2xl font-bold mb-4">Step 3</h3>
          <p>Stay connected and manage your community life.</p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
