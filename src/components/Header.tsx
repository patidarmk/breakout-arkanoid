import * as React from "react";
import { Link } from "@tanstack/react-router";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl shadow-lg border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-indigo-500 via-pink-500 to-amber-400 flex items-center justify-center shadow-md">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none">
              <path d="M3 12h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M12 3v18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <Link to="/" className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-500">
              Arcane Breaker
            </Link>
            <div className="text-xs text-gray-500">Classic brick-breaking reimagined</div>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">Home</Link>
          <Link to="/play" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">Play</Link>
          <Link to="/levels" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">Levels</Link>
          <Link to="/about" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">About</Link>
          <Link to="/contact" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">Contact</Link>
        </nav>

        <div className="flex items-center space-x-3">
          <a href="https://applaa.com" target="_blank" rel="noreferrer" className="text-sm text-gray-500 hover:text-gray-700">Applaa</a>
          <div className="md:hidden">
            <button className="p-2 rounded-md bg-gray-100 hover:bg-gray-200">
              <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none">
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}