import React from "react";
import { Link } from "react-router-dom";

const UnderDevelopment = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#185697] to-[#2a6ba8] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img
              src="/hyperlocal.png"
              alt="HyperLocal Logo"
              className="h-32 w-auto"
            />
          </div>

          {/* Icon */}
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#F69130] bg-opacity-10">
              <svg
                className="w-12 h-12 text-[#F69130]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-[#185697] mb-4">
            Under Development
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-600 mb-8">
            This page is currently under construction. We're working hard to
            bring you something amazing!
          </p>

          {/* Additional Info */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <p className="text-sm text-gray-500">
              🚧 We're building something great for you
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Check back soon for updates
            </p>
          </div>

          {/* Back Button */}
          <Link
            to="/"
            className="inline-block px-8 py-3 bg-[#F69130] text-white font-bold rounded-lg hover:bg-[#e57f1f] transition shadow-lg"
          >
            Back to Home
          </Link>
        </div>

        {/* Footer Note */}
        <p className="text-center text-white text-sm mt-8 opacity-75">
          © 2025 HyperLocal Delivery. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default UnderDevelopment;
