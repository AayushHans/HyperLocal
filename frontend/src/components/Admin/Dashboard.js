import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { useSocket } from "../../contexts/SocketContext";
import EditProfile from "../Auth/EditProfile";
import StatsCards from "./StatsCards";
import OrdersTable from "./OrdersTable";
import UsersTable from "./UsersTable";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({});
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const { user } = useAuth();
  const { connected } = useSocket();

  const API_URL = process.env.REACT_APP_API_URL || "";

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/users/dashboard-stats`);
      setStats(response.data.stats);
    } catch (error) {
      toast.error("Failed to fetch dashboard stats");
    }
  };

  const fetchOrders = async (status = "") => {
    try {
      setLoading(true);
      const url = status
        ? `${API_URL}/api/orders/all?status=${status}`
        : `${API_URL}/api/orders/all`;
      const response = await axios.get(url);
      setOrders(response.data.orders);
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async (role = "") => {
    try {
      setLoading(true);
      const url = role
        ? `${API_URL}/api/users?role=${role}`
        : `${API_URL}/api/users`;
      const response = await axios.get(url);
      setUsers(response.data.users);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === "orders") {
      fetchOrders();
    } else if (activeTab === "users") {
      fetchUsers();
    }
  }, [activeTab]);

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
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Monitor and manage the delivery platform
            </p>
          </div>

          <div className="border-b-2 border-gray-200 mb-8">
            <nav className="-mb-0.5 flex space-x-8">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-3 px-1 border-b-4 font-semibold text-sm transition ${
                  activeTab === "overview"
                    ? "border-[#F69130] text-[#F69130]"
                    : "border-transparent text-gray-500 hover:text-[#185697]"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`py-3 px-1 border-b-4 font-semibold text-sm transition ${
                  activeTab === "orders"
                    ? "border-[#F69130] text-[#F69130]"
                    : "border-transparent text-gray-500 hover:text-[#185697]"
                }`}
              >
                Orders
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`py-3 px-1 border-b-4 font-semibold text-sm transition ${
                  activeTab === "users"
                    ? "border-[#F69130] text-[#F69130]"
                    : "border-transparent text-gray-500 hover:text-[#185697]"
                }`}
              >
                Users
              </button>
            </nav>
          </div>

          <div>
            {activeTab === "overview" && <StatsCards stats={stats} />}
            {activeTab === "orders" && (
              <OrdersTable
                orders={orders}
                loading={loading}
                onFilterChange={fetchOrders}
              />
            )}
            {activeTab === "users" && (
              <UsersTable
                users={users}
                loading={loading}
                onFilterChange={fetchUsers}
              />
            )}
          </div>
        </div>
      </div>
      {editing && <EditProfile onClose={() => setEditing(false)} />}
    </>
  );
};

export default AdminDashboard;
