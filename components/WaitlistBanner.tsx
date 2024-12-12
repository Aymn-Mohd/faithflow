'use client';

import React from 'react';
import { X } from 'lucide-react';

export default function WaitlistBanner() {
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-8 md:right-auto z-50">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-accent p-4 max-w-md">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            📱 Join the waitlist for our upcoming mobile app!
          </p>
          <div className="flex items-center gap-2">
            <a
              href="https://getwaitlist.com/waitlist/22943"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-accent hover:opacity-90"
            >
              Join Now
            </a>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 