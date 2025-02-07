
'use client';

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import  Card from "@/components/ui/card";

const ActiveUsers = ({ data }) => {
  return (
   
      <Card className="p-6">
        <div className="mb-4">
          <h3 className="text-lg text-black font-semibold">Active Users</h3>
          <p className="text-sm text-gray-500">Real-time user activity</p>
          <p className="text-2xl text-black font-bold">{data.current}</p>
          <p className="text-sm text-gray-500">
            {data.trend > 0 ? "↑" : "↓"} {Math.abs(data.trend)}% from last period
          </p>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.chartData}>
              <defs>
                <linearGradient id="activeUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#activeUsers)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    
  );
};

export default ActiveUsers;