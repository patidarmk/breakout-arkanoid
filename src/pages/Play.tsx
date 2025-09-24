import * as React from "react";
import BrickBreakerGame from "@/components/BrickBreakerGame";
import levels from "@/data/levels";

const Play = () => {
  // allow ?level=#
  const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const levelId = params.get("level") || levels[0].id;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Play</h2>
          <p className="text-sm text-gray-500">Use keyboard, touch, or device tilt to control the paddle. Space to launch.</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/levels" className="text-sm text-indigo-600 hover:underline">Change level</a>
        </div>
      </div>

      <div className="w-full bg-gradient-to-b from-slate-900 to-slate-800 rounded-lg p-4 shadow-lg">
        <div className="w-full h-[640px] rounded-md overflow-hidden bg-black">
          <BrickBreakerGame levelId={String(levelId)} />
        </div>
      </div>
    </div>
  );
};

export default Play;