import React from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AvailableOrders = ({ orders, loading, onOrderAccepted }) => {
  const API_URL = process.env.REACT_APP_API_URL || "";

  const handleAcceptOrder = async (orderId) => {
    try {
      await axios.post(`${API_URL}/api/orders/${orderId}/accept`);
      toast.success("Order accepted successfully!");
      onOrderAccepted();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to accept order");
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
        <h2 className="text-xl font-semibold text-gray-900">
          Available Orders
        </h2>
      </div>

      {orders.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No available orders at the moment. Check back later!
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
                <button
                  onClick={() => handleAcceptOrder(order.id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Accept Order
                </button>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailableOrders;
