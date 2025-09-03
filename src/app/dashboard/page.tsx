'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import FarmerDashboard from '@/components/dashboard/FarmerDashboard';
import DistributorDashboard from '@/components/dashboard/DistributorDashboard';
import RetailerDashboard from '@/components/dashboard/RetailerDashboard';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Skeleton className="h-12 w-1/4 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'farmer':
        return <FarmerDashboard />;
      case 'distributor':
        return <DistributorDashboard />;
      case 'retailer':
        return <RetailerDashboard />;
      case 'admin':
        // Redirect admin to the smart contract auditor page
        router.push('/admin/smart-contract-auditor');
        return null;
      default:
        return (
          <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-4">Welcome, {user.email}</h1>
            <p>Your dashboard is not yet configured. Please contact support.</p>
          </div>
        );
    }
  };

  return <>{renderDashboard()}</>;
}
