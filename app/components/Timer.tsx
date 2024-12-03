'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface TimerProps {
  onComplete: () => void;
}

export default function Timer({ onComplete }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [sessionName, setSessionName] = useState('Focus Session');
  const [isBreak, setIsBreak] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const saveSession = useCallback(() => {
    const sessions = JSON.parse(localStorage.getItem('pomodoro-sessions') || '[]');
    sessions.push({
      date: new Date(),
      duration: isBreak ? 5 * 60 : 25 * 60,
      name: sessionName,
    });
    localStorage.setItem('pomodoro-sessions', JSON.stringify(sessions));
  }, [sessionName, isBreak]);

  const handleComplete = useCallback(() => {
    saveSession();
    setIsRunning(false);
    setIsBreak(!isBreak);
    setTimeLeft(isBreak ? 25 * 60 : 5 * 60);
    onComplete();
  }, [isBreak, onComplete, saveSession]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, handleComplete]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(25 * 60);
    setIsBreak(false);
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white/5 rounded-xl p-8 flex flex-col items-center space-y-6">
        <input
          type="text"
          value={sessionName}
          onChange={(e) => setSessionName(e.target.value)}
          className="bg-transparent border-b border-white/20 text-center text-xl font-semibold focus:outline-none focus:border-white/40 px-4 py-2 w-full"
          placeholder="Session Name"
        />

        <div className="text-6xl font-bold font-mono">
          {formatTime(timeLeft)}
        </div>

        <div className="flex gap-4">
          <button
            onClick={toggleTimer}
            className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 font-semibold transition-all"
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={resetTimer}
            className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 font-semibold transition-all"
          >
            Reset
          </button>
        </div>

        <div className="text-sm text-white/60">
          {isBreak ? 'Break Time' : 'Focus Time'}
        </div>
      </div>
    </div>
  );
} 