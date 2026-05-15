import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ChatWindow from "../Chat/ChatWindow";
import { BsChatDots } from "react-icons/bs";

const MyDeliveries = ({ orders, loading, onStatusUpdated }) => {
  const [updatingStatus, setUpdatingStatus] = useState({});
  const [activeChat, setActiveChat] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL || "";

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdatingStatus((prev) => ({ ...prev, [orderId]: true }));

      const statusMessages = {
        picked: "Items picked up from store",
        delivered: "Order delivered successfully",
      };

      await axios.put(`${API_URL}/api/orders/${orderId}/status`, {
        status: newStatus,
        message: statusMessages[newStatus],
      });

      toast.success(`Order status updated to ${newStatus}!`);
      onStatusUpdated();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update status");
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "bg-blue-100 text-blue-800";
      case "picked":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case "accepted":
        return "picked";
      case "picked":
        return "delivered";
      default:
        return null;
    }
  };

  const getNextStatusLabel = (currentStatus) => {
    switch (currentStatus) {
      case "accepted":
        return "Mark as Picked";
      case "picked":
        return "Mark as Delivered";
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
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
        <h2 className="text-xl font-semibold text-gray-900">My Deliveries</h2>
      </div>

      {orders.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No deliveries assigned yet. Accept some orders to get started!
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {orders.map((order) => {
            const nextStatus = getNextStatus(order.status);
            const nextStatusLabel = getNextStatusLabel(order.status);

            return (
              <div key={order.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Order #{order.id}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        order.status,
                      )}`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                    {nextStatus && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, nextStatus)}
                        disabled={updatingStatus[order.id]}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded text-sm font-medium disabled:opacity-50"
                      >
                        {updatingStatus[order.id]
                          ? "Updating..."
                          : nextStatusLabel}
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">
                      Category
                    </h4>
                    <p className="text-sm text-gray-600 capitalize">
                      {order.category}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">
                      Customer
                    </h4>
                    <p className="text-sm text-gray-600">
                      {order.customer_name}
                      {order.customer_phone && (
                        <span className="text-gray-500">
                          {" "}
                          • {order.customer_phone}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">
                    Items
                  </h4>
                  <p className="text-sm text-gray-600">{order.items_text}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">
                      Pickup Address
                    </h4>
                    <p className="text-sm text-gray-600">
                      {order.pickup_address}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">
                      Delivery Address
                    </h4>
                    <p className="text-sm text-gray-600">
                      {order.delivery_address}
                    </p>
                  </div>
                </div>

                {(order.status === "accepted" || order.status === "picked") && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveChat(order.id)}
                      className="px-4 py-2 bg-[#185697] text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                    >
                      <BsChatDots size={20} />
                      Chat with Customer
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {activeChat && (
        <ChatWindow orderId={activeChat} onClose={() => setActiveChat(null)} />
      )}
    </div>
  );
};

export default MyDeliveries;
