'use client';

import React, { useState } from 'react';
import Timer from '@/components/Timer';
import Stats from '@/components/Stats';
import PrayerTimes from '@/components/PrayerTimes';
import ProductivityGraph from '@/components/ProductivityGraph';
import Duas from '@/components/Duas';
import { Card, CardContent } from '@/components/ui/card';
import { Info } from 'lucide-react';

export default function Home() {
  const [isBreak, setIsBreak] = useState(false);

  const handleTimerComplete = (isBreakTime: boolean) => {
    setIsBreak(isBreakTime);
  };

  const handleSkipBreak = () => {
    setIsBreak(false);
  };

  return (
    <div className="min-h-screen bg-gradient-theme">
      <main className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="max-w-2xl mx-auto mb-24">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
            🕋 FaithFlow
          </h1>
          <p className="text-gray-500 text-center mb-12">
            Focus with purpose, break with remembrance
          </p>

          <Timer 
            onComplete={handleTimerComplete} 
            onSkipBreak={handleSkipBreak}
          />
          
          {isBreak && (
            <div className="mt-8">
              <Duas isBreak={true} />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <Stats />
            <ProductivityGraph />
          </div>
          <div className="space-y-8">
            <PrayerTimes />
            <Duas isBreak={false} />
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Info className="w-4 h-4" />
                    <h3 className="text-sm font-medium">About & Credits</h3>
                  </div>
                  <div className="space-y-2 text-sm text-gray-500">
                    <p>
                      Duas sourced from{' '}
                      <a
                        href="https://imanupdate.com/dua-for-success/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gray-700 underline underline-offset-2"
                      >
                        Iman Update
                      </a>
                      {' '}and{' '}
                      <a
                        href="https://quran.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gray-700 underline underline-offset-2"
                      >
                        Quran.com
                      </a>
                    </p>
                    <p>
                      Prayer times powered by{' '}
                      <a
                        href="https://aladhan.com/prayer-times-api"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gray-700 underline underline-offset-2"
                      >
                        Al Adhan API
                      </a>
                      {' '}• Location search by{' '}
                      <a
                        href="https://nominatim.org/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gray-700 underline underline-offset-2"
                      >
                        OpenStreetMap Nominatim
                      </a>
                    </p>
                  </div>
                  <div className="space-y-2 pt-2 border-t border-gray-50">
                    <p className="text-xs text-gray-400">
                      Built with faith and focus in mind • Open source and free to use
                    </p>
                    <p className="text-xs text-gray-400">
                      Made with 🧡 by{' '}
                      <a
                        href="https://twitter.com/aymnmohdd"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gray-700 underline underline-offset-2"
                      >
                        @aymnmohdd
                      </a>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
