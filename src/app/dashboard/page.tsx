
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        const role = user.user_metadata.role;
        if (role === 'farmer') {
          router.replace('/dashboard/farmer');
        } else if (role === 'distributor') {
          router.replace('/dashboard/distributor');
        } else if (role === 'retailer') {
          router.replace('/dashboard/retailer');
        } else if (role === 'customer') {
          router.replace('/trace');
        } else {
          router.replace('/unauthorized');
        }
      } else {
        router.replace('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
      <p className="ml-4">Loading your dashboard...</p>
    </div>
  );
}
