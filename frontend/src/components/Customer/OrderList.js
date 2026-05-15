import React, { useState } from "react";
import ChatWindow from "../Chat/ChatWindow";
import { BsChatDots } from "react-icons/bs";

const OrderList = ({ orders, loading }) => {
  const [activeChat, setActiveChat] = useState(null);
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-blue-100 text-blue-800";
      case "picked":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
        <h2 className="text-xl font-semibold text-gray-900">My Orders</h2>
      </div>

      {orders.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No orders found. Create your first order!
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {orders.map((order) => (
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
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    order.status,
                  )}`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
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
                    Delivery Partner
                  </h4>
                  <p className="text-sm text-gray-600">
                    {order.agent_name || "Not assigned yet"}
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

              {order.agent_id &&
                (order.status === "accepted" || order.status === "picked") && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveChat(order.id)}
                      className="px-4 py-2 bg-[#185697] text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                    >
                      <BsChatDots size={20} />
                      Chat with Agent
                    </button>
                  </div>
                )}
            </div>
          ))}
        </div>
      )}

      {activeChat && (
        <ChatWindow orderId={activeChat} onClose={() => setActiveChat(null)} />
      )}
    </div>
  );
};

export default OrderList;
