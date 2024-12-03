'use client';

import React from 'react';
import { Clock, Palette, X } from 'lucide-react';

interface SettingsProps {
  focusTime: number;
  breakTime: number;
  longBreakTime: number;
  onFocusTimeChange: (minutes: number) => void;
  onBreakTimeChange: (minutes: number) => void;
  onLongBreakTimeChange: (minutes: number) => void;
  isOpen: boolean;
  onClose: () => void;
}

const themeColors = [
  { name: 'Gray', value: 'gray-900', color: 'rgb(17, 24, 39)' },
  { name: 'Pink', value: 'pink-600', color: 'rgb(219, 39, 119)' },
  { name: 'Green', value: 'emerald-600', color: 'rgb(5, 150, 105)' },
  { name: 'Blue', value: 'blue-600', color: 'rgb(37, 99, 235)' },
  { name: 'Purple', value: 'purple-600', color: 'rgb(124, 58, 237)' },
  { name: 'Rose', value: 'rose-600', color: 'rgb(225, 29, 72)' },
  { name: 'Orange', value: 'orange-600', color: 'rgb(234, 88, 12)' },
];

const timerPresets = [
  { name: '25/5', focus: 25, break: 5, longBreak: 15 },
  { name: '50/10', focus: 50, break: 10, longBreak: 30 },
  { name: '45/15', focus: 45, break: 15, longBreak: 30 },
];

export default function Settings({
  focusTime,
  breakTime,
  longBreakTime,
  onFocusTimeChange,
  onBreakTimeChange,
  onLongBreakTimeChange,
  isOpen,
  onClose,
}: SettingsProps) {
  const [selectedColor, setSelectedColor] = React.useState('gray-900');

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    document.documentElement.style.setProperty('--accent-color', `var(--${color})`);
    localStorage.setItem('theme-color', color);
  };

  React.useEffect(() => {
    const savedColor = localStorage.getItem('theme-color') || 'gray-900';
    setSelectedColor(savedColor);
    document.documentElement.style.setProperty('--accent-color', `var(--${savedColor})`);
  }, []);

  const handlePresetSelect = (preset: typeof timerPresets[0]) => {
    onFocusTimeChange(preset.focus);
    onBreakTimeChange(preset.break);
    onLongBreakTimeChange(preset.longBreak);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50">
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-lg font-medium text-gray-900">Settings</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <div className="p-6 space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-gray-500">
                <Clock className="w-4 h-4" />
                <h3 className="text-sm font-medium">Timer Settings</h3>
              </div>

              <div className="flex gap-2">
                {timerPresets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => handlePresetSelect(preset)}
                    className="flex-1 px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-600 font-medium transition-colors"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <TimeSlider
                  label="Focus Duration"
                  value={focusTime}
                  onChange={onFocusTimeChange}
                  min={5}
                  max={60}
                  step={5}
                />
                <TimeSlider
                  label="Break Duration"
                  value={breakTime}
                  onChange={onBreakTimeChange}
                  min={1}
                  max={15}
                  step={1}
                />
                <TimeSlider
                  label="Long Break Duration"
                  value={longBreakTime}
                  onChange={onLongBreakTimeChange}
                  min={5}
                  max={30}
                  step={5}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-2 text-gray-500">
                <Palette className="w-4 h-4" />
                <h3 className="text-sm font-medium">Theme Color</h3>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {themeColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => handleColorChange(color.value)}
                    style={{ backgroundColor: color.color }}
                    className={`w-8 h-8 rounded-full transition-all ${
                      selectedColor === color.value
                        ? 'ring-2 ring-offset-2 ring-gray-400'
                        : 'hover:ring-2 hover:ring-offset-2 hover:ring-gray-200'
                    }`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimeSlider({ label, value, onChange, min, max, step }: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="text-gray-900 font-medium">{value}m</span>
      </div>
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="w-full accent-gray-900"
      />
    </div>
  );
} 