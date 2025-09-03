
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScanLine } from 'lucide-react';

export default function TracePage() {
  const router = useRouter();

  const handleTrace = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const lotId = formData.get('lotId') as string;
    if (lotId) {
      router.push(`/trace/${lotId}`);
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center py-20 px-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="text-center">
          <ScanLine className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-3xl font-headline">Trace Your Produce</CardTitle>
          <CardDescription>Enter any Lot ID to see its journey from farm to table.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTrace} className="flex flex-col sm:flex-row gap-4">
            <Input 
              name="lotId" 
              placeholder="Enter Lot ID..." 
              className="text-center text-lg h-12"
              required 
            />
            <Button type="submit" size="lg" className="h-12">Trace</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
