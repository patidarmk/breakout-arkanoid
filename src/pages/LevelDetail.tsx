import * as React from "react";
import { useParams, Link } from "@tanstack/react-router";
import levels from "@/data/levels";

const Breadcrumbs = ({ level }: { level: { id: string; title: string } | null }) => {
  return (
    <nav className="text-sm text-gray-500 mb-4">
      <Link to="/" className="text-indigo-600 hover:underline">Home</Link>
      <span className="mx-2">/</span>
      <Link to="/levels" className="text-indigo-600 hover:underline">Levels</Link>
      {level && (
        <>
          <span className="mx-2">/</span>
          <span className="text-gray-700">{level.title}</span>
        </>
      )}
    </nav>
  );
};

const LevelDetail = () => {
  const params = useParams() as any;
  const id = params.levelId as string;
  const level = levels.find((l) => l.id === id) || null;

  if (!level) {
    return (
      <div>
        <h2 className="text-2xl font-semibold">Level not found</h2>
        <p className="text-gray-500 mt-2">This level does not exist.</p>
        <div className="mt-4">
          <Link to="/levels" className="text-indigo-600 hover:underline">Back to levels</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs level={level} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="rounded overflow-hidden shadow">
            <img src={level.thumbnail} alt={level.title} className="w-full h-64 object-cover" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{level.title}</h1>
            <p className="mt-2 text-gray-600">{level.description}</p>
            <div className="mt-4 text-sm text-gray-500">Difficulty: {level.difficulty}</div>
            <div className="mt-6 flex items-center gap-3">
              <Link to={`/play?level=${level.id}`} className="px-4 py-2 bg-indigo-600 text-white rounded">Play this level</Link>
              <Link to="/levels" className="px-4 py-2 border rounded">Back</Link>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="bg-white rounded p-4 shadow">
            <h3 className="font-semibold">Layout</h3>
            <p className="text-sm text-gray-500 mt-2">Bricks: {level.bricks.length}</p>
          </div>
          <div className="bg-white rounded p-4 shadow">
            <h3 className="font-semibold">Tips</h3>
            <ul className="mt-2 text-sm text-gray-600 space-y-1">
              <li>Use the paddle edge to angle shots.</li>
              <li>Collect power-ups to turn the tide.</li>
              <li>Laser powerups are great for dense walls.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default LevelDetail;