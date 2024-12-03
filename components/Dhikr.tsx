'use client';

import React, { useState, useEffect } from 'react';
import { Shuffle } from 'lucide-react';

interface DhikrProps {
  isBreak: boolean;
}

const dhikrData = {
  focus: [
    {
      arabic: "رَبِّ زِدْنِي عِلْمًا",
      translation: "My Lord, increase me in knowledge",
      transliteration: "Rabbi zidni ilma",
      source: "Quran 20:114"
    },
    {
      arabic: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي",
      translation: "My Lord, expand for me my chest and ease for me my task",
      transliteration: "Rabbi-isyrahli sadri, wa yassir li amri",
      source: "Quran 20:25-26"
    },
    {
      arabic: "اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا",
      translation: "O Allah, nothing is easy except what You make easy",
      transliteration: "Allahumma la sahla illa ma ja'altahu sahla",
      source: "Ibn Hibban"
    }
  ],
  break: [
    {
      arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
      translation: "All praise is due to Allah, Lord of the worlds",
      transliteration: "Alhamdulillahi Rabbil 'Alamin",
      source: "Al-Fatiha: 1"
    },
    {
      arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
      translation: "Glory be to Allah and His is the praise",
      transliteration: "Subhanallahi Wa Bihamdihi",
      source: "Bukhari & Muslim"
    },
    {
      arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا",
      translation: "O Allah, I ask You for knowledge that is beneficial",
      transliteration: "Allahumma inni as'aluka 'ilman nafi'an",
      source: "Ibn Majah"
    }
  ]
};

export default function Dhikr({ isBreak }: DhikrProps) {
  const [currentDhikr, setCurrentDhikr] = useState(dhikrData[isBreak ? 'break' : 'focus'][0]);
  const [isFlipped, setIsFlipped] = useState(false);

  const changeDhikr = () => {
    const currentList = dhikrData[isBreak ? 'break' : 'focus'];
    const currentIndex = currentList.findIndex(d => d.arabic === currentDhikr.arabic);
    const nextIndex = (currentIndex + 1) % currentList.length;
    setCurrentDhikr(currentList[nextIndex]);
  };

  useEffect(() => {
    const interval = setInterval(changeDhikr, 30000);
    return () => clearInterval(interval);
  }, [isBreak, currentDhikr]);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <p className="text-xs text-white/50">
          {isBreak ? 'Break time dhikr' : 'Focus time dua'}
        </p>
        <button
          onClick={changeDhikr}
          className="p-1.5 rounded-full hover:bg-white/5 transition-colors group"
          title="Change Dhikr"
        >
          <Shuffle className="w-3 h-3 text-white/40 group-hover:text-white/60 transition-colors" />
        </button>
      </div>

      <div 
        className="perspective-1000 cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={`relative transition-transform duration-500 transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}>
          {/* Front side */}
          <div className="bg-white/5 dark:bg-black/40 backdrop-blur-xl rounded-xl p-6 backface-hidden">
            <div className="space-y-4 text-center">
              <p className="text-2xl font-arabic leading-loose tracking-wider">
                {currentDhikr.arabic}
              </p>
              <p className="text-sm text-white/70">
                {currentDhikr.transliteration}
              </p>
            </div>
          </div>

          {/* Back side */}
          <div className="absolute inset-0 bg-white/5 dark:bg-black/40 backdrop-blur-xl rounded-xl p-6 rotate-y-180 backface-hidden">
            <div className="space-y-4 text-center">
              <p className="text-lg text-white/90">
                {currentDhikr.translation}
              </p>
              <p className="text-xs text-white/50">
                {currentDhikr.source}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2 text-center">
        <p className="text-xs text-white/50">
          Click card to see translation
        </p>
      </div>
    </div>
  );
} 