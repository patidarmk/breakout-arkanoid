import * as React from "react";
import AppLink from "@/components/AppLink";
import levels from "@/data/levels";

const Index = () => {
  const featured = levels[0];
  return (
    <div className="min-h-[72vh] flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl text-center">
        <h1 className="text-5xl sm:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-500">
          Arcane Breaker
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Rediscover the timeless brick-breaker with realistic physics, power-ups,
          multi-ball chaos, and handcrafted level designs.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <AppLink to="/play" className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-indigo-600 text-white font-medium shadow hover:bg-indigo-700">
            Play Now
          </AppLink>
          <AppLink to="/levels" className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-50">
            Browse Levels
          </AppLink>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          <div className="rounded-xl overflow-hidden shadow-lg">
            <img src={featured.thumbnail} alt={featured.title} className="w-full h-48 object-cover" />
          </div>
          <div className="text-left">
            <h3 className="text-2xl font-semibold">{featured.title}</h3>
            <p className="mt-2 text-gray-600">{featured.description}</p>
            <div className="mt-4 text-sm text-gray-500">Difficulty: {featured.difficulty}</div>
            <div className="mt-6">
              <AppLink to={`/levels/${featured.id}`} className="text-indigo-600 hover:underline">View level details →</AppLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;