
'use client';

import { useState, useEffect } from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth';
import Header from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';
import SplashScreen from '@/components/SplashScreen';

// export const metadata: Metadata = {
//   title: 'AgroTrace - Trust in Every Bite',
//   description: 'Bringing transparency to the food supply chain from farm to fork.',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500); // Show splash for 2.5 seconds
    return () => clearTimeout(timer);
  }, []);

  // Set document title
  useEffect(() => {
    document.title = 'AgroTrace - Trust in Every Bite';
  }, []);

  return (
    <html lang="en" className="h-full scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        {loading ? (
          <SplashScreen />
        ) : (
          <AuthProvider>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </AuthProvider>
        )}
        <Toaster />
      </body>
    </html>
  );
}
