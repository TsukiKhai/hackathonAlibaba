import React from "react";
import { Outlet, NavLink } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1e3a8a] text-white flex flex-col p-4">
        <h1 className="text-2xl font-bold mb-6">Expense Tracker</h1>
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
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
