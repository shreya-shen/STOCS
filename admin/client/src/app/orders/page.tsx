"use client";

import { FC, useState, useEffect } from "react";
import {
  useGetPendingOrdersQuery,
  useGetCompletedOrdersQuery,
  Order,
} from "@/state/api";

const OrdersPage: FC = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [tokenNumber, setTokenNumber] = useState<String | null>(null);

  // Initialize local state for pending and completed orders
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);

  // Fetch initial data from the API
  const { data: fetchedPendingOrders } = useGetPendingOrdersQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const { data: fetchedCompletedOrders } = useGetCompletedOrdersQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (fetchedPendingOrders) {
      setPendingOrders(fetchedPendingOrders);
    }
    if (fetchedCompletedOrders) {
      setCompletedOrders(fetchedCompletedOrders);
    }
  }, [fetchedPendingOrders, fetchedCompletedOrders]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (pendingOrders && pendingOrders.length > 0) {
      setTokenNumber(pendingOrders[0].token);
    }
  }, [pendingOrders]);

  const handleOrderCompletion = (orderId: string) => {
    const order = pendingOrders.find((order) => order.orderId === orderId);
    if (order) {
      // Move the order to the completed list
      setPendingOrders((prev) => prev.filter((order) => order.orderId !== orderId));
      setCompletedOrders((prev) => [...prev, order]);
    }
  };

  const renderOrderTable = (orders: Order[] | undefined, isPending: boolean) => {
    const orderList = orders || [];

    if (orderList.length === 0) {
      return <p className="text-gray-500">No orders available</p>;
    }

    return (
      <table className="w-full table-auto border-collapse bg-white shadow-md">
        <thead>
          <tr className="text-left text-gray-500">
            <th className="py-3 px-5">Token Number</th>
            <th className="py-3 px-5">Order ID</th>
            <th className="py-3 px-5">Products</th>
            <th className="py-3 px-5">Total Cost</th>
            {isPending && <th className="py-3 px-5">Complete</th>}
          </tr>
        </thead>
        <tbody>
          {orderList.map((order) => (
            <tr key={order.orderId} className="border-b">
              <td className="py-4 px-5">{order.token}</td>
              <td className="py-4 px-5">{order.orderId}</td>
              <td className="py-4 px-5 space-y-2">
                {order.products.map((product, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-gray-100 p-2 rounded-md shadow-sm"
                  >
                    <span>{product.name}</span>
                    <span>Quantity: {product.quantity}</span>
                  </div>
                ))}
              </td>
              <td className="py-4 px-5">₹{order.totalCost}</td>
              {isPending && (
                <td className="py-4 px-5 text-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600"
                    onChange={() => handleOrderCompletion(order.orderId)}
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  if (activeTab === "pending" && !pendingOrders.length) {
    return <div className="p-6">Loading pending orders...</div>;
  }

  if (activeTab === "completed" && !completedOrders.length) {
    return <div className="p-6">Loading completed orders...</div>;
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-lg relative">
      {/* Top Right Info */}
      <div className="absolute top-4 right-4 text-right">
        <p className="text-sm text-gray-600">{currentDateTime.toLocaleString()}</p>
        <p className="text-lg font-bold">Token: {tokenNumber ?? "N/A"}</p>
      </div>

      {/* Toggle Buttons */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded-full ${
              activeTab === "pending"
                ? "bg-gray-900 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("pending")}
          >
            Pending Orders
          </button>
          <button
            className={`px-4 py-2 rounded-full ${
              activeTab === "completed"
                ? "bg-gray-900 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("completed")}
          >
            Completed Orders
          </button>
        </div>
      </div>

      {/* Orders Tables */}
      {activeTab === "pending" && (
        <div>
          <h4 className="text-lg font-semibold mb-3">Pending Orders</h4>
          {renderOrderTable(pendingOrders, true)}
        </div>
      )}

      {activeTab === "completed" && (
        <div>
          <h4 className="text-lg font-semibold mb-3">Completed Orders</h4>
          {renderOrderTable(completedOrders, false)}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;