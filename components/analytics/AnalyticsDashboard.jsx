
"use client"; 

import React from "react";
import TopProducts from "./TopProducts";
import ActiveUsers from "./ActiveUsers";
import RevenueChart from "./RevenueChart";

const AnalyticsDashboard = ({ data, userData }) => {
  // Calculate some summary metrics
  const totalRevenue = data.products.reduce(
    (sum, product) => sum + product.price * product.stock,
    0
  );
  const totalProducts = data.products.reduce((sum,product) => sum+product.stock,0);
  const averageRating =
    data.products.reduce((sum, product) => sum + product.rating, 0) /
    totalProducts;
  const lowStockItems = data.products.filter((p) => p.stock < 10).length;

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Revenue</h3>
          <p className="text-2xl font-bold text-black">
            ${totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Products</h3>
          <p className="text-2xl font-bold text-black">{totalProducts}</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Average Rating</h3>
          <p className="text-2xl font-bold text-black">
            {averageRating.toFixed(1)}
          </p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Low Stock Items</h3>
          <p className="text-2xl font-bold text-black">{lowStockItems}</p>
        </div>
      </div>
      {/* Revenue Chart */}
      <div className="grid gap-6">
        <RevenueChart />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <ActiveUsers data={userData} />
        <TopProducts products={data.products} />
      </div>
      {/* <RevenueChart data={data.revenueData} />  */}
    </div>
  );
};

export default AnalyticsDashboard;
