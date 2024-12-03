'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Settings as SettingsIcon, Edit2, Check, ChevronRight } from 'lucide-react';
import Settings from './Settings';
import { Card } from './ui/card';

interface TimerProps {
  onComplete: (isBreakTime: boolean) => void;
  onSkipBreak: () => void;
}

export default function Timer({ onComplete, onSkipBreak }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionName, setSessionName] = useState('Focus Session');
  const [isBreak, setIsBreak] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [focusTime, setFocusTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [isLongBreak, setIsLongBreak] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [longBreakTime, setLongBreakTime] = useState(15);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(sessionName);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const saveSession = useCallback(() => {
    const sessions = JSON.parse(localStorage.getItem('pomodoro-sessions') || '[]');
    const session = {
      date: new Date(),
      duration: isBreak 
        ? (isLongBreak ? longBreakTime : breakTime) * 60 
        : focusTime * 60,
      name: sessionName,
      type: isBreak ? (isLongBreak ? 'longBreak' : 'break') : 'focus',
      completed: true
    };
    
    console.log('Saving session:', session);
    sessions.push(session);
    localStorage.setItem('pomodoro-sessions', JSON.stringify(sessions));
  }, [sessionName, isBreak, isLongBreak, focusTime, breakTime, longBreakTime]);

  const handleFocusTimeChange = (minutes: number) => {
    setFocusTime(minutes);
    if (!isRunning && !isBreak) {
      setTimeLeft(minutes * 60);
    }
  };

  const handleBreakTimeChange = (minutes: number) => {
    setBreakTime(minutes);
    if (!isRunning && isBreak) {
      setTimeLeft(minutes * 60);
    }
  };

  const handleLongBreakTimeChange = (minutes: number) => {
    setLongBreakTime(minutes);
    if (!isRunning && isLongBreak) {
      setTimeLeft(minutes * 60);
    }
  };

  const handleComplete = useCallback(() => {
    if (timeLeft === 0) {
      saveSession();
    }
    
    if (isBreak) {
      setIsBreak(false);
      setTimeLeft(focusTime * 60);
      setIsRunning(false);
      onComplete(false);
    } else {
      window.dispatchEvent(new Event('focusComplete'));
      setSessionCount(prev => prev + 1);
      
      console.log('Session count:', sessionCount + 1);
      
      if (sessionCount + 1 >= 4) {
        setIsLongBreak(true);
        setTimeLeft(longBreakTime * 60);
        setSessionCount(0);
        setIsBreak(true);
        setIsRunning(true);
        onComplete(true);
      } else {
        setIsBreak(true);
        setTimeLeft(breakTime * 60);
        setIsRunning(true);
        onComplete(true);
      }
    }
  }, [isBreak, onComplete, saveSession, focusTime, breakTime, longBreakTime, sessionCount, timeLeft]);

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

  const getSessionInfo = () => {
    if (isBreak) {
      return isLongBreak ? 'Long Break' : 'Break Time';
    }
    return `Focus Session ${sessionCount + 1}/4`;
  };

  const skipAllBreaks = () => {
    if (isBreak) {
      setIsBreak(false);
      setIsLongBreak(false);
      setTimeLeft(focusTime * 60);
      setIsRunning(false);
      setSessionCount(0);
      onSkipBreak();
    }
  };

  const handleNameSave = () => {
    if (tempName.trim()) {
      setSessionName(tempName.trim());
    }
    setIsEditingName(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSave();
    } else if (e.key === 'Escape') {
      setIsEditingName(false);
      setTempName(sessionName);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex flex-col items-center gap-4 mb-8">
        {isEditingName ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onKeyDown={handleKeyPress}
              className="text-lg font-medium text-gray-800 bg-gray-50 border border-gray-200 rounded-full px-6 py-2 w-[200px] text-center focus:outline-none focus:border-gray-300"
              placeholder="Session name..."
              autoFocus
              maxLength={30}
            />
            <button
              onClick={handleNameSave}
              className="p-1.5 rounded-full hover:bg-gray-100"
            >
              <Check className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="bg-accent-lighter px-6 py-2 rounded-full border border-accent">
              <h2 className="text-lg font-medium text-gray-800">
                {sessionName}
              </h2>
            </div>
            <button
              onClick={() => {
                setIsEditingName(true);
                setTempName(sessionName);
              }}
              className="p-1.5 rounded-full hover:bg-gray-100 transition-all"
            >
              <Edit2 className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        )}
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400 bg-accent-lighter px-3 py-1 rounded-full border border-accent">
            Session {sessionCount + 1}/4
          </span>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-full hover:bg-gray-50 transition-all"
          >
            <SettingsIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      <Card>
        <div className="text-center space-y-12">
          <div className="font-timer text-[120px] font-medium tracking-tight text-gray-900">
            {formatTime(timeLeft)}
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="flex justify-center gap-4">
              <button
                onClick={toggleTimer}
                className={`px-12 py-3 rounded-xl font-medium transition-all ${
                  isRunning
                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    : 'bg-accent hover:opacity-90 text-white'
                }`}
              >
                {isRunning ? 'Pause' : 'Start'}
              </button>
              <button
                onClick={resetTimer}
                className="px-12 py-3 rounded-xl font-medium bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 transition-all"
              >
                Reset
              </button>
            </div>

            {isBreak && (
              <button
                onClick={skipAllBreaks}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-all"
              >
                <span>Skip break</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </Card>

      <Settings
        focusTime={focusTime}
        breakTime={breakTime}
        longBreakTime={longBreakTime}
        onFocusTimeChange={handleFocusTimeChange}
        onBreakTimeChange={handleBreakTimeChange}
        onLongBreakTimeChange={handleLongBreakTimeChange}
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
} 