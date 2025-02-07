

'use client';

import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const RevenueChart = () => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const response = await fetch('https://dummyjson.com/products');
        const data = await response.json();

        // Transform products data into daily revenue data
        const transformedData = data.products.map((product, index) => {
          const date = new Date();
          date.setDate(date.getDate() - (data.products.length - index - 1));
          
          return {
            date: date.toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            }),
            amount: product.price * product.stock
          };
        });

        setChartData(transformedData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching revenue data:', error);
        setIsLoading(false);
      }
    };

    fetchRevenueData();
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <div className="h-[300px] flex items-center justify-center">
            <p>Loading revenue data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg text-black font-semibold">Revenue Over Time</h3>
          <p className="text-sm text-gray-500">Daily revenue breakdown</p>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                fontSize={12}
                tickMargin={10}
              />
              <YAxis
                fontSize={12}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                tickMargin={10}
              />
              <Tooltip
                contentStyle={{ backgroundColor: 'white', borderRadius: '8px' }}
                formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;