
'use client';

import { useState, useEffect } from 'react';
import { AuthProvider } from '@/lib/auth';
import Header from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';
import SplashScreen from '@/components/SplashScreen';
import { usePathname } from 'next/navigation';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // We can keep a very short delay to prevent flickering on fast connections,
    // or remove it entirely. 500ms is a reasonable compromise.
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Don't show header/footer on auth pages for a cleaner look
  const showHeaderFooter = !['/login', '/register'].includes(pathname);

  return (
    <>
      {loading ? (
        <SplashScreen />
      ) : (
        <AuthProvider>
          {showHeaderFooter && <Header />}
          <main className="flex-grow">{children}</main>
          {showHeaderFooter && <Footer />}
        </AuthProvider>
      )}
      <Toaster />
    </>
  );
}
