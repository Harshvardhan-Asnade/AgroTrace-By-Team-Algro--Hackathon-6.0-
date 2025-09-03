'use client';

import { useAuth, UserRole } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/Logo';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = (role: UserRole) => {
    login(role);
  };

  return (
    <Card className="w-full max-w-md shadow-2xl bg-card">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4">
          <Logo />
        </div>
        <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
        <CardDescription>Select a role to simulate login.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={() => handleLogin('farmer')} className="w-full" size="lg">
          Login as Farmer
        </Button>
        <Button onClick={() => handleLogin('distributor')} className="w-full" size="lg" variant="secondary">
          Login as Distributor
        </Button>
        <Button onClick={() => handleLogin('retailer')} className="w-full" size="lg" variant="secondary">
          Login as Retailer
        </Button>
        <Button onClick={() => handleLogin('admin')} className="w-full" size="lg" variant="outline">
          Login as Admin
        </Button>
      </CardContent>
    </Card>
  );
}
