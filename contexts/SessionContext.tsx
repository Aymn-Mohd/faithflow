'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface Session {
  date: Date;
  duration: number;
  type: 'focus' | 'break' | 'longBreak';
  name?: string;
  completed: boolean;
}

interface SessionStats {
  focusSessions: number;
  totalMinutes: number;
  todayMinutes: number;
  streak: number;
  weeklyStats: {
    day: string;
    minutes: number;
    sessions: number;
  }[];
}

interface SessionContextType {
  stats: SessionStats;
  refreshStats: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<SessionStats>({
    focusSessions: 0,
    totalMinutes: 0,
    todayMinutes: 0,
    streak: 0,
    weeklyStats: []
  });

  const calculateStats = useCallback(() => {
    try {
      const sessions = JSON.parse(localStorage.getItem('pomodoro-sessions') || '[]') as Session[];
      const focusSessions = sessions.filter(s => s.type === 'focus' && s.completed);
      const today = new Date().toISOString().split('T')[0];

      // Calculate daily stats
      const totalMinutes = Math.round(
        focusSessions.reduce((acc, s) => acc + s.duration / 60, 0)
      );

      const todayMinutes = Math.round(
        focusSessions
          .filter(s => new Date(s.date).toISOString().startsWith(today))
          .reduce((acc, s) => acc + s.duration / 60, 0)
      );

      // Calculate streak
      const dates = [...new Set(
        focusSessions.map(s => new Date(s.date).toISOString().split('T')[0])
      )].sort();
      
      let streak = 0;
      const todayTime = new Date().setHours(0, 0, 0, 0);
      let checkDate = new Date(todayTime);

      for (let i = dates.length - 1; i >= 0; i--) {
        const sessionDate = new Date(dates[i]).setHours(0, 0, 0, 0);
        if (sessionDate === checkDate.getTime()) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }

      // Calculate weekly stats
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const weeklyStats = days.map((day, index) => {
        const date = new Date();
        date.setDate(date.getDate() - (date.getDay() - index));
        const dayStr = date.toISOString().split('T')[0];

        const dayFocusSessions = focusSessions.filter(s => 
          new Date(s.date).toISOString().startsWith(dayStr)
        );

        return {
          day,
          minutes: Math.round(
            dayFocusSessions.reduce((acc, s) => acc + s.duration / 60, 0)
          ),
          sessions: dayFocusSessions.length
        };
      });

      setStats({
        focusSessions: focusSessions.length,
        totalMinutes,
        todayMinutes,
        streak,
        weeklyStats
      });
    } catch (error) {
      console.error('Error calculating stats:', error);
    }
  }, []);

  useEffect(() => {
    calculateStats();
    
    // Listen for storage changes
    window.addEventListener('storage', calculateStats);
    // Listen for focus completion
    window.addEventListener('focusComplete', calculateStats);
    // Listen for visibility changes
    document.addEventListener('visibilitychange', calculateStats);
    
    return () => {
      window.removeEventListener('storage', calculateStats);
      window.removeEventListener('focusComplete', calculateStats);
      document.removeEventListener('visibilitychange', calculateStats);
    };
  }, [calculateStats]);

  return (
    <SessionContext.Provider value={{ stats, refreshStats: calculateStats }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
} 