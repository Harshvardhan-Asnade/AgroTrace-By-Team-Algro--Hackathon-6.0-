'use client';

import { useAuth, UserRole } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/Logo';
import Link from 'next/link';

export default function RegisterPage() {
  const { login } = useAuth();

  const handleRegister = (role: UserRole) => {
    login(role);
  };

  return (
    <Card className="w-full max-w-md shadow-2xl bg-card">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4">
          <Logo />
        </div>
        <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
        <CardDescription>Join AgriTrace by selecting your role.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={() => handleRegister('farmer')} className="w-full" size="lg">
          Register as Farmer
        </Button>
        <Button onClick={() => handleRegister('distributor')} className="w-full" size="lg" variant="secondary">
          Register as Distributor
        </Button>
        <Button onClick={() => handleRegister('retailer')} className="w-full" size="lg" variant="secondary">
          Register as Retailer
        </Button>
        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Log in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
