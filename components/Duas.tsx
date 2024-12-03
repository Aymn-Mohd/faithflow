'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, ChevronRight } from 'lucide-react';

interface Dua {
  arabic: string;
  transliteration: string;
  translation: string;
  source: string;
  reference?: string;
}

const focusDuas: Dua[] = [
  {
    arabic: "رَبِّ اشْرَحْ لِي صَدْرِي * وَيَسِّرْ لِي أَمْرِي * وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي * يَفْقَهُوا قَوْلِي",
    transliteration: "Rabbi ishrah lee sadree Wayassir lee amree Wahlul uqdatan min lisanee Yafqahoo qawlee",
    translation: "O Lord, lift up my heart and ease my task for me. Untie my tongue, so that they may understand my words.",
    source: "Surah Taha (20:25-28)",
    reference: "https://quran.com/20/25-28"
  },
  {
    arabic: "رَبِّ زِدْنِي عِلْمًا",
    transliteration: "Rabbi Zidni Ilman",
    translation: "O my Lord, increase me in knowledge",
    source: "Surah Taha (20:114)",
    reference: "https://quran.com/20/114"
  },
  {
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلاً مُتَقَبَّلاً",
    transliteration: "Allahumma inni as-aluka 'ilman naafi'an, wa rizqan tayyiban, wa 'amalan mutaqabbalan",
    translation: "O Allah, I ask You for beneficial knowledge, good provision and acceptable deeds.",
    source: "Hadith",
    reference: "https://quran.com/20/25-28"
  }
];

const breakDuas: Dua[] = [
  {
    arabic: "اللهُمَّ لا سَهْلَ إلا مَا جَعَلتَهُ سَهْلا وَ أنتَ تَجْعَلُ الحزْنَ إذا شِئْتَ سَهْلا",
    transliteration: "Allahumma la sahla illa ma ja'altahu sahla, wa 'anta taj-alul hazna idha shi'ta sahla",
    translation: "O Allah! Nothing is easy except what You make easy, and You make the difficult easy if it be Your Will.",
    source: "Hadith",
    reference: "https://quran.com/20/25-28"
  },
  {
    arabic: "يَا حَيُّ يَا قَيُّومُ، بِرَحْمَتِكَ أَسْتَغِيثُ",
    transliteration: "Ya Hayyu Ya Qayyum, birahmatika astaghitsu",
    translation: "O Ever-Living, O Self-Subsisting, by Your mercy I seek assistance",
    source: "Hadith",
    reference: "https://quran.com/20/25-28"
  }
];

interface DuasProps {
  isBreak: boolean;
}

export default function Duas({ isBreak }: DuasProps) {
  const [currentDua, setCurrentDua] = React.useState(0);
  const duas = isBreak ? breakDuas : focusDuas;

  const nextDua = () => {
    setCurrentDua((prev) => (prev + 1) % duas.length);
  };

  React.useEffect(() => {
    const interval = setInterval(nextDua, 30000);
    return () => clearInterval(interval);
  }, [duas.length]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Book className="w-4 h-4 text-gray-500" />
            <CardTitle className="text-base font-medium text-gray-800">
              {isBreak ? 'Break Time Dua' : 'Focus Time Dua'}
            </CardTitle>
          </div>
          <button
            onClick={nextDua}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-all"
            title="Next Dua"
          >
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 text-center">
          <p className="text-2xl font-arabic leading-loose tracking-wider text-gray-800">
            {duas[currentDua].arabic}
          </p>
          <p className="text-sm text-gray-600 italic">
            {duas[currentDua].transliteration}
          </p>
          <p className="text-base text-gray-700">
            {duas[currentDua].translation}
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <span>{duas[currentDua].source}</span>
            {duas[currentDua].reference && (
              <>
                <span>•</span>
                <a
                  href={duas[currentDua].reference}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-700 underline underline-offset-2"
                >
                  Reference
                </a>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 