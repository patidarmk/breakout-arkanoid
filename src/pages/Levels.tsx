import * as React from "react";
import { Link } from "@tanstack/react-router";
import levels from "@/data/levels";

const PAGE_SIZE = 6;

const Levels = () => {
  const [query, setQuery] = React.useState("");
  const [page, setPage] = React.useState(0);

  const filtered = levels.filter(
    (l) =>
      l.title.toLowerCase().includes(query.toLowerCase()) ||
      l.description.toLowerCase().includes(query.toLowerCase()) ||
      l.difficulty.toLowerCase().includes(query.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageItems = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Levels</h2>
          <p className="text-sm text-gray-500">Pick a challenge — each level has unique layouts and difficulty.</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            placeholder="Search levels..."
            className="px-3 py-2 rounded-md border bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pageItems.map((l) => (
          <div key={l.id} className="bg-white rounded-lg shadow p-4">
            <img src={l.thumbnail} alt={l.title} className="w-full h-36 object-cover rounded" />
            <div className="mt-3">
              <h3 className="font-semibold">{l.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{l.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-xs text-gray-500">Difficulty: {l.difficulty}</div>
                <Link to={`/levels/${l.id}`} className="text-indigo-600 hover:underline text-sm">Details →</Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          className="px-3 py-2 rounded bg-gray-100 disabled:opacity-50"
        >
          Prev
        </button>
        <div className="text-sm text-gray-600">
          Page {page + 1} / {Math.max(1, totalPages)}
        </div>
        <button
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={page >= totalPages - 1}
          className="px-3 py-2 rounded bg-gray-100 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Levels;