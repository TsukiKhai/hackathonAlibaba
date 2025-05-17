import React from "react";
import { Outlet, NavLink } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-[#1e3a8a] text-white flex flex-col p-4">
          <h1 className="text-2xl font-bold mb-6">Freelance Tracker</h1>
          <nav className="space-y-2">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `w-full block px-4 py-2 rounded ${
                  isActive ? "bg-white/20" : "hover:bg-white/10"
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `w-full block px-4 py-2 rounded ${
                  isActive ? "bg-white/20" : "hover:bg-white/10"
                }`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/upload"
              className={({ isActive }) =>
                `w-full block px-4 py-2 rounded ${
                  isActive ? "bg-white/20" : "hover:bg-white/10"
                }`
              }
            >
              Upload
            </NavLink>
            <NavLink
              to="/manual-entry"
              className={({ isActive }) =>
                `w-full block px-4 py-2 rounded ${
                  isActive ? "bg-white/20" : "hover:bg-white/10"
                }`
              }
            >
              Manual Entry
            </NavLink>
            <NavLink
              to="/reports"
              className={({ isActive }) =>
                `w-full block px-4 py-2 rounded ${
                  isActive ? "bg-white/20" : "hover:bg-white/10"
                }`
              }
            >
              Reports
            </NavLink>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-100 py-4 text-sm">
        <div className="container mx-auto px-4 text-center">
          <div className="font-bold text-blue-300 mb-2">Strategic Synergy</div>

          <ul className="inline-flex flex-wrap justify-center gap-x-6 gap-y-1 mt-1 p-0 list-none">
            <li className="flex items-center">
              <span className="text-blue-400 mr-1">•</span> Fabian Tan Hann Shen
            </li>
            <li className="flex items-center">
              <span className="text-blue-400 mr-1">•</span> Chong Kai Zhi
            </li>
            <li className="flex items-center">
              <span className="text-blue-400 mr-1">•</span> Tan Yuett Ning
            </li>
            <li className="flex items-center">
              <span className="text-blue-400 mr-1">•</span> Tan Wee Jin
            </li>
          </ul>

          <div className="mt-2 text-gray-400">Alibaba Hackathon 2025</div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
