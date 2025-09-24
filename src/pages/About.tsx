import * as React from "react";

const About = () => {
  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-3xl font-bold">About Arcane Breaker</h1>
      <p className="text-gray-600">
        Arcane Breaker is a modern take on the classic brick-breaking game with
        realistic physics, tactile controls, and carefully designed levels.
      </p>

      <section className="bg-white rounded-lg p-4 shadow">
        <h3 className="font-semibold">Our mission</h3>
        <p className="mt-2 text-gray-600">
          To craft elegant, responsive gameplay that combines nostalgia with
          contemporary design and device-friendly controls.
        </p>
      </section>

      <section className="bg-white rounded-lg p-4 shadow">
        <h3 className="font-semibold">The Team</h3>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 inline-flex items-center justify-center text-white font-bold">AC</div>
            <div className="mt-2 font-medium">A. Collins</div>
            <div className="text-sm text-gray-500">Game Design</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-400 to-blue-500 inline-flex items-center justify-center text-white font-bold">MJ</div>
            <div className="mt-2 font-medium">M. Jia</div>
            <div className="text-sm text-gray-500">Frontend</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-red-400 inline-flex items-center justify-center text-white font-bold">RK</div>
            <div className="mt-2 font-medium">R. Kaur</div>
            <div className="text-sm text-gray-500">Physics</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;