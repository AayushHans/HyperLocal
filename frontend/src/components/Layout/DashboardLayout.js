import React from "react";
import { Link } from "react-router-dom";

const DashboardLayout = ({ children, title, subtitle, onLogout }) => {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-lg border-b-2 border-gray-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img
              src="/hyperlocal.png"
              alt="HyperLocal Logo"
              className="h-20 w-auto hover:opacity-90 transition"
            />
          </Link>
          <button
            onClick={onLogout}
            className="px-5 py-2 text-sm font-medium text-[#185697] border-2 border-[#185697] rounded-lg hover:bg-[#185697] hover:text-white transition"
          >
            Logout
          </button>
        </nav>
      </header>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#185697]">{title}</h1>
            {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
