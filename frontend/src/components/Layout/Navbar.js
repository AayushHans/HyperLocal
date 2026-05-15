import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useSocket } from "../../contexts/SocketContext";
import EditProfile from "../Auth/EditProfile";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { connected } = useSocket();

  const handleLogout = () => {
    logout();
  };

  const [editing, setEditing] = useState(false);
  const openEditor = () => setEditing(true);
  const closeEditor = () => setEditing(false);

  return (
    <>
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-primary-600">
                  DeliveryApp
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    connected ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <span className="text-sm text-gray-600">
                  {connected ? "Connected" : "Disconnected"}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  {user?.name} ({user?.role})
                </span>
                <button onClick={openEditor} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">Edit Profile</button>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      {editing && <EditProfile onClose={closeEditor} />}
    </>
  );
};

export default Navbar;
