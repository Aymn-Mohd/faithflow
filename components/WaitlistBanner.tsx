'use client';

import React from 'react';
import { X } from 'lucide-react';

export default function WaitlistBanner() {
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-accent/5 border-b border-accent/10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="animate-pulse">📱</span>
            <p className="text-sm text-gray-600">
              Join the waitlist for our upcoming mobile app!
            </p>
          </div>
          <div className="flex items-center gap-3">
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
              className="p-1 hover:bg-accent/10 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 