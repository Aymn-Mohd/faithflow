import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SessionProvider } from '@/contexts/SessionContext';
import { Analytics } from '@vercel/analytics/next';
import WaitlistBanner from '@/components/WaitlistBanner';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "FaithFlow",
  description: "Islamic Pomodoro Timer",
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🕋</text></svg>",
        type: "image/svg+xml",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="description" content="Islamic Pomodoro Timer - Focus with purpose, break with remembrance" />
        <meta name="keywords" content="pomodoro, islamic, timer, productivity, focus, prayer times, duas" />
        <meta property="og:title" content="FaithFlow - Islamic Pomodoro Timer" />
        <meta property="og:description" content="Focus with purpose, break with remembrance. An Islamic Pomodoro Timer with prayer times and duas." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://faithflow-pi.vercel.app" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@aymnmohdd" />
      </head>
      <body className={`${geistSans.variable} antialiased`}>
        <SessionProvider>
          <WaitlistBanner />
          <main>
            {children}
          </main>
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  );
}
