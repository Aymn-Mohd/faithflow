'use client';

import React from 'react';
import { LineChart, Clock, TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { useSession } from '@/contexts/SessionContext';

const chartConfig = {
  focus: {
    label: "Focus Time",
    color: "rgb(17, 24, 39)",
  },
};

export default function ProductivityGraph() {
  const { stats } = useSession();
  const weeklyStats = stats.weeklyStats;
  const totalTime = weeklyStats.reduce((acc, day) => acc + day.minutes, 0);

  const chartData = weeklyStats.map(stat => ({
    day: stat.day,
    focus: stat.minutes,
  }));

  const maxMinutes = Math.max(...weeklyStats.map(d => d.minutes), 60);
  const weeklyAverage = Math.round(totalTime / 7);
  const todayMinutes = weeklyStats[weeklyStats.length - 1]?.minutes || 0;
  const yesterdayMinutes = weeklyStats[weeklyStats.length - 2]?.minutes || 0;
  const trend = todayMinutes - yesterdayMinutes;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LineChart className="w-4 h-4 text-gray-500" />
            <CardTitle className="text-base font-medium text-gray-800">Weekly Overview</CardTitle>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-50/50 px-3 py-1.5 rounded-full">
              <Clock className="w-3 h-3 text-gray-500" />
              <span className="text-xs text-gray-600">{weeklyAverage}m avg/day</span>
            </div>
            {trend !== 0 && (
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                trend > 0 
                  ? 'bg-green-50 text-green-700' 
                  : 'bg-red-50 text-red-700'
              }`}>
                <TrendingUp className={`w-3 h-3 ${trend < 0 ? 'rotate-180' : ''}`} />
                <span>{Math.abs(trend)}m</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ChartContainer config={chartConfig}>
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-color)" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="var(--accent-color)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  vertical={false} 
                  stroke="rgba(17, 24, 39, 0.1)" 
                />
                <XAxis 
                  dataKey="day" 
                  stroke="rgb(107, 114, 128)"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={12}
                  fontSize={12}
                  tick={{ fill: 'rgb(107, 114, 128)' }}
                />
                <YAxis
                  stroke="rgb(107, 114, 128)"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={12}
                  fontSize={12}
                  tick={{ fill: 'rgb(107, 114, 128)' }}
                  tickFormatter={(value) => `${value}m`}
                />
                <Area
                  type="monotone"
                  dataKey="focus"
                  stroke="var(--accent-color)"
                  strokeWidth={2}
                  fill="url(#focusGradient)"
                  dot={{
                    r: 4,
                    fill: "white",
                    strokeWidth: 2,
                    stroke: "var(--accent-color)"
                  }}
                  activeDot={{
                    r: 6,
                    fill: "var(--accent-color)",
                    stroke: "white",
                    strokeWidth: 2
                  }}
                />
                {/* Average line */}
                {weeklyAverage > 0 && (
                  <line
                    x1="0%"
                    x2="100%"
                    y1={`${100 - (weeklyAverage / maxMinutes) * 100}%`}
                    y2={`${100 - (weeklyAverage / maxMinutes) * 100}%`}
                    stroke="rgb(17, 24, 39)"
                    strokeDasharray="4 4"
                    strokeOpacity={0.3}
                  />
                )}
              </AreaChart>
            </ChartContainer>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex justify-center gap-6 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-900/10 border-2 border-gray-900"></div>
            <span>Daily Focus Time</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0 border border-dashed border-gray-900/30"></div>
            <span>Daily Average ({weeklyAverage}m)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 