import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { useSocket } from "../../contexts/SocketContext";
import { useNotifications } from "../../contexts/NotificationContext";
import EditProfile from "../Auth/EditProfile";
import AvailableOrders from "./AvailableOrders";
import MyDeliveries from "./MyDeliveries";

const AgentDashboard = () => {
  const [activeTab, setActiveTab] = useState("available");
  const [availableOrders, setAvailableOrders] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const { user } = useAuth();
  const { connected } = useSocket();
  const { getTotalUnread } = useNotifications();

  const API_URL = process.env.REACT_APP_API_URL || "";

  const fetchAvailableOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/orders/available`);
      setAvailableOrders(response.data.orders);
    } catch (error) {
      toast.error("Failed to fetch available orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/orders/my-orders`);
      setMyOrders(response.data.orders);
    } catch (error) {
      toast.error("Failed to fetch my orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "available") {
      fetchAvailableOrders();
    } else if (activeTab === "deliveries") {
      fetchMyOrders();
    }
  }, [activeTab]);

  const handleOrderAccepted = () => {
    fetchAvailableOrders();
    fetchMyOrders();
  };

  const handleStatusUpdated = () => {
    fetchMyOrders();
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <>
      <div className="min-h-screen bg-white">
        <header className="bg-white shadow-lg border-b-2 border-gray-200">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
            <Link to="/" className="flex items-center -my-12">
              <img
                src="/hyperlocal.png"
                alt="HyperLocal Logo"
                className="h-48 w-auto hover:opacity-90 transition"
              />
            </Link>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    connected ? "bg-[#5CB85C]" : "bg-red-500"
                  }`}
                ></div>
                <span className="text-sm text-gray-600">
                  {connected ? "Connected" : "Disconnected"}
                </span>
              </div>
              {getTotalUnread() > 0 && (
                <button
                  onClick={() => setActiveTab("deliveries")}
                  className="relative p-2 text-[#185697] hover:bg-gray-100 rounded-lg transition"
                  title="Unread messages"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {getTotalUnread()}
                  </span>
                </button>
              )}
              <span className="text-sm font-medium text-[#185697]">
                {user?.name} ({user?.role})
              </span>
              <button
                onClick={() => setEditing(true)}
                className="px-5 py-2 text-sm font-medium text-white bg-[#5CB85C] rounded-lg hover:bg-[#4a9d4a] transition"
              >
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className="px-5 py-2 text-sm font-medium text-[#185697] border-2 border-[#185697] rounded-lg hover:bg-[#185697] hover:text-white transition"
              >
                Logout
              </button>
            </div>
          </nav>
        </header>

        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#185697]">
              Delivery Partner Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Accept orders and manage deliveries
            </p>
          </div>

          <div className="border-b-2 border-gray-200 mb-8">
            <nav className="-mb-0.5 flex space-x-8">
              <button
                onClick={() => setActiveTab("available")}
                className={`py-3 px-1 border-b-4 font-semibold text-sm transition ${
                  activeTab === "available"
                    ? "border-[#F69130] text-[#F69130]"
                    : "border-transparent text-gray-500 hover:text-[#185697]"
                }`}
              >
                Available Orders
              </button>
              <button
                onClick={() => setActiveTab("deliveries")}
                className={`py-3 px-1 border-b-4 font-semibold text-sm transition ${
                  activeTab === "deliveries"
                    ? "border-[#F69130] text-[#F69130]"
                    : "border-transparent text-gray-500 hover:text-[#185697]"
                }`}
              >
                My Deliveries
              </button>
            </nav>
          </div>

          <div>
            {activeTab === "available" && (
              <AvailableOrders
                orders={availableOrders}
                loading={loading}
                onOrderAccepted={handleOrderAccepted}
              />
            )}
            {activeTab === "deliveries" && (
              <MyDeliveries
                orders={myOrders}
                loading={loading}
                onStatusUpdated={handleStatusUpdated}
              />
            )}
          </div>
        </div>
      </div>
      {editing && <EditProfile onClose={() => setEditing(false)} />}
    </>
  );
};

export default AgentDashboard;
