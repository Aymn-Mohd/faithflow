'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Timer, BarChart2, Calendar } from 'lucide-react';
import { useSession } from '@/contexts/SessionContext';

export default function Stats() {
  const { stats } = useSession();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-gray-500" />
          <CardTitle className="text-base font-medium text-gray-800">Statistics</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50/50 rounded-xl p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Timer className="w-4 h-4 text-gray-500" />
              <p className="text-sm text-gray-500">Today</p>
            </div>
            <p className="text-2xl font-bold text-gray-800">{stats.todayMinutes}m</p>
          </div>
          <div className="bg-gray-50/50 rounded-xl p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <BarChart2 className="w-4 h-4 text-gray-500" />
              <p className="text-sm text-gray-500">Total</p>
            </div>
            <p className="text-2xl font-bold text-gray-800">{stats.totalMinutes}m</p>
          </div>
          <div className="bg-gray-50/50 rounded-xl p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Timer className="w-4 h-4 text-gray-500" />
              <p className="text-sm text-gray-500">Sessions</p>
            </div>
            <p className="text-2xl font-bold text-gray-800">{stats.focusSessions}</p>
          </div>
          <div className="bg-gray-50/50 rounded-xl p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <p className="text-sm text-gray-500">Streak</p>
            </div>
            <p className="text-2xl font-bold text-gray-800">{stats.streak}d</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 