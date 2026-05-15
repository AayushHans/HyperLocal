import React from "react";

const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: "Total Customers",
      value: stats.users?.customer || 0,
      color: "bg-blue-500",
      icon: "👥",
    },
    {
      title: "Total Agents",
      value: stats.users?.agent || 0,
      color: "bg-green-500",
      icon: "🚚",
    },
    {
      title: "Total Orders",
      value: Object.values(stats.orders || {}).reduce(
        (sum, count) => sum + count,
        0
      ),
      color: "bg-purple-500",
      icon: "📦",
    },
    {
      title: "Today's Orders",
      value: stats.todayOrders || 0,
      color: "bg-yellow-500",
      icon: "📅",
    },
    {
      title: "Active Deliveries",
      value: stats.activeDeliveries || 0,
      color: "bg-red-500",
      icon: "🚀",
    },
    {
      title: "Completed Orders",
      value: stats.orders?.delivered || 0,
      color: "bg-indigo-500",
      icon: "✅",
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div
                    className={`${card.color} rounded-md p-3 text-white text-2xl`}
                  >
                    {card.icon}
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {card.title}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {card.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Status Breakdown */}
      {stats.orders && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Order Status Breakdown
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats.orders).map(([status, count]) => (
              <div key={status} className="text-center">
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-sm text-gray-500 capitalize">{status}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsCards;
