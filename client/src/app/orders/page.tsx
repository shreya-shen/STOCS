"use client"
import React, { useState } from "react";

const Orders = () => {
  const [pendingOrders, setPendingOrders] = useState([
    { id: 1, name: "Order 1", description: "Pending order 1 details" },
    { id: 2, name: "Order 2", description: "Pending order 2 details" },
    { id: 3, name: "Order 3", description: "Pending order 3 details" },
  ]);

  const [completedOrders, setCompletedOrders] = useState([
    { id: 4, name: "Order 4", description: "Completed order 4 details" },
  ]);

  const handleCompleteOrder = (order: any) => {
    setPendingOrders((prev) => prev.filter((o) => o.id !== order.id));
    setCompletedOrders((prev) => [...prev, order]);
  };

  return (
    <div className="row-span-3 xl:row-span-8 bg-white shadow-md rounded-2xl p-5">
      <h3 className="text-lg font-semibold pb-4">Orders</h3>

      <div className="flex justify-center border-b mb-4">
        <button
          className="px-4 py-2 text-blue-600 font-semibold focus:outline-none border-b-2 border-blue-600"
          onClick={() => document.getElementById("pending-tab")?.scrollIntoView()}
        >
          Pending Orders
        </button>
        <button
          className="px-4 py-2 text-gray-500 font-semibold focus:outline-none"
          onClick={() =>
            document.getElementById("completed-tab")?.scrollIntoView()
          }
        >
          Completed Orders
        </button>
      </div>

      <div>
        {/* Pending Orders Tab */}
        <div id="pending-tab">
          <h4 className="text-md font-semibold mb-3">Pending Orders</h4>
          {pendingOrders.length === 0 ? (
            <div className="text-gray-500">No pending orders.</div>
          ) : (
            <div className="overflow-auto h-40">
              {pendingOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between gap-3 px-5 py-4 border-b"
                >
                  <div>
                    <h5 className="font-bold text-gray-700">{order.name}</h5>
                    <p className="text-sm text-gray-500">
                      {order.description}
                    </p>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-blue-600"
                      onChange={() => handleCompleteOrder(order)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed Orders Tab */}
        <div id="completed-tab" className="mt-8">
          <h4 className="text-md font-semibold mb-3">Completed Orders</h4>
          {completedOrders.length === 0 ? (
            <div className="text-gray-500">No completed orders.</div>
          ) : (
            <div className="overflow-auto h-40">
              {completedOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between gap-3 px-5 py-4 border-b"
                >
                  <div>
                    <h5 className="font-bold text-gray-700">{order.name}</h5>
                    <p className="text-sm text-gray-500">
                      {order.description}
                    </p>
                  </div>
                  <div className="text-green-500 font-semibold">
                    Completed
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
