import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const UsersTable = ({ users, loading, onFilterChange }) => {
  const [roleFilter, setRoleFilter] = useState("");
  const [actionLoading, setActionLoading] = useState({});

  const API_URL = process.env.REACT_APP_API_URL || "";

  const handleFilterChange = (role) => {
    setRoleFilter(role);
    onFilterChange(role);
  };

  const handleSuspendUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to suspend ${userName}?`)) {
      return;
    }

    setActionLoading((prev) => ({ ...prev, [userId]: true }));

    try {
      await axios.put(`${API_URL}/api/users/${userId}/suspend`);
      toast.success("User suspended successfully");
      onFilterChange(roleFilter); // Refresh the users list
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to suspend user");
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const handleUnsuspendUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to unsuspend ${userName}?`)) {
      return;
    }

    setActionLoading((prev) => ({ ...prev, [userId]: true }));

    try {
      await axios.put(`${API_URL}/api/users/${userId}/unsuspend`);
      toast.success("User unsuspended successfully");
      onFilterChange(roleFilter); // Refresh the users list
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to unsuspend user");
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "customer":
        return "bg-blue-100 text-blue-800";
      case "agent":
        return "bg-green-100 text-green-800";
      case "admin":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Users Management
          </h2>
          <div className="flex space-x-2">
            <select
              value={roleFilter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="">All Roles</option>
              <option value="customer">Customers</option>
              <option value="agent">Agents</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="p-6 text-center text-gray-500">No users found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.phone || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
                        user.role,
                      )}`}
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.suspended
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.suspended ? "Suspended" : "Active"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {user.role !== "admin" && (
                      <div className="flex space-x-2">
                        {user.suspended ? (
                          <button
                            onClick={() =>
                              handleUnsuspendUser(user.id, user.name)
                            }
                            disabled={actionLoading[user.id]}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50"
                          >
                            {actionLoading[user.id] ? "..." : "Unsuspend"}
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              handleSuspendUser(user.id, user.name)
                            }
                            disabled={actionLoading[user.id]}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          >
                            {actionLoading[user.id] ? "..." : "Suspend"}
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsersTable;
