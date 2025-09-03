
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { createProduceLot, getLotsForFarmer, refreshSchemaCache } from '@/lib/database';
import type { ProduceLot } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { QrCode, PlusCircle, Leaf, Package, Truck, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';

export default function FarmerDashboard() {
  const { user } = useAuth();
  const [lots, setLots] = useState<ProduceLot[]>([]);
  const [loading, setLoading] = useState(true);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchLots = async () => {
    if (user) {
      await refreshSchemaCache();
      const farmerLots = await getLotsForFarmer(user.id);
      setLots(farmerLots);
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    fetchLots();
  }, [user]);

  const handleRegisterProduce = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || !user.id || !user.email) {
       toast({ variant: 'destructive', title: 'Not logged in', description: 'You must be logged in to register a batch.' });
      return;
    }
    setFormSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const newLotData: Omit<ProduceLot, 'id' | 'certificates' | 'history'> & { history: any[] } = {
      name: formData.get('produceName') as string,
      origin: formData.get('origin') as string,
      plantingDate: formData.get('plantingDate') as string,
      harvestDate: formData.get('harvestDate') as string,
      itemCount: parseInt(formData.get('itemCount') as string),
      farmer: { id: user.id, name: user.email },
      history: [
        {
          status: 'Registered' as const,
          timestamp: new Date().toISOString(),
          location: formData.get('origin') as string,
          actor: user.email,
        },
      ],
    };

    try {
      await createProduceLot(newLotData);
      toast({ title: 'Success', description: 'New produce batch registered!' });
      (event.target as HTMLFormElement).reset();
      // Refetch lots to show the new one
      await fetchLots(); 
    } catch (error: any) {
        console.error('Detailed error registering batch:', error);
        toast({
            variant: 'destructive',
            title: 'Registration Failed',
            description: `An unexpected error occurred: ${error.message}`,
            duration: 9000
        });
    } finally {
      setFormSubmitting(false);
    }
  };
  
  const stats = {
    totalBatches: lots.length,
    totalItems: lots.reduce((acc, lot) => acc + lot.itemCount, 0),
    inTransit: lots.filter(lot => lot.history[lot.history.length-1].status.startsWith('In-Transit')).length,
  };

  if (loading) {
    return (
        <div className="container mx-auto py-10 px-4 space-y-8">
            <Skeleton className="h-10 w-1/3 mb-8" />
            <div className="grid gap-6 md:grid-cols-3">
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
            </div>
            <div className="grid md:grid-cols-3 gap-8">
                <Skeleton className="md:col-span-1 h-96" />
                <Skeleton className="md:col-span-2 h-96" />
            </div>
        </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4 space-y-8">
      <h1 className="text-4xl font-bold font-headline tracking-tight">Farmer Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Batches</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBatches}</div>
            <p className="text-xs text-muted-foreground">batches registered</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">items across all batches</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Batches In Transit</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inTransit}</div>
            <p className="text-xs text-muted-foreground">currently being shipped</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><PlusCircle /> Register New Batch</CardTitle>
            <CardDescription>Add a new lot of produce to the supply chain.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegisterProduce} className="space-y-4">
              <fieldset disabled={formSubmitting} className="contents">
                <div className="space-y-1">
                  <Label htmlFor="produceName">Produce Name</Label>
                  <Input id="produceName" name="produceName" placeholder="e.g., Organic Gala Apples" required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="origin">Origin</Label>
                  <Input id="origin" name="origin" placeholder="e.g., Sunny Orchard, WA" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Label htmlFor="plantingDate">Planting Date</Label>
                        <Input id="plantingDate" name="plantingDate" type="date" required />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="harvestDate">Harvest Date</Label>
                        <Input id="harvestDate" name="harvestDate" type="date" required />
                    </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="itemCount">Items in Lot</Label>
                  <Input id="itemCount" name="itemCount" type="number" placeholder="e.g., 1000" required />
                </div>
                <Button type="submit" className="w-full" disabled={formSubmitting}>
                  {formSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Register Batch
                </Button>
              </fieldset>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>My Produce Batches</CardTitle>
            <CardDescription>A list of all the produce you have registered on AgroTrace.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lot ID</TableHead>
                  <TableHead>Produce</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Trace</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lots.length > 0 ? (
                    lots.map((lot) => (
                    <TableRow key={lot.id}>
                        <TableCell className="font-medium">{lot.id}</TableCell>
                        <TableCell>{lot.name}</TableCell>
                        <TableCell>{lot.itemCount.toLocaleString()}</TableCell>
                        <TableCell>
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary">
                                {lot.history[lot.history.length - 1].status}
                            </span>
                        </TableCell>
                        <TableCell className="text-right">
                        <Button asChild variant="ghost" size="icon">
                            <Link href={`/trace/${lot.id}`} title="View QR and Trace">
                            <QrCode className="h-4 w-4" />
                            </Link>
                        </Button>
                        </TableCell>
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center h-24">
                            You haven’t registered any batches yet.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
