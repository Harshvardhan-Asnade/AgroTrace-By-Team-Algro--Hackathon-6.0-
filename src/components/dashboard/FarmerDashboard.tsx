
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { createProduceLot, getLotsForFarmer } from '@/lib/database';
import type { ProduceLot } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { QrCode, PlusCircle, Upload, Wallet, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';

export default function FarmerDashboard() {
  const { user, wallet, connectWallet } = useAuth();
  const [lots, setLots] = useState<ProduceLot[]>([]);
  const [loading, setLoading] = useState(true);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      const fetchLots = async () => {
        setLoading(true);
        const farmerLots = await getLotsForFarmer(user.id);
        setLots(farmerLots);
        setLoading(false);
      };
      fetchLots();
    }
  }, [user]);

  const handleRegisterProduce = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!wallet.address) {
      toast({ variant: 'destructive', title: 'Wallet not connected', description: 'Please connect your wallet to register a batch.' });
      return;
    }
    if (!user) {
       toast({ variant: 'destructive', title: 'Not logged in', description: 'You must be logged in.' });
      return;
    }
    setFormSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const newLotData = {
      id: `LOT-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      name: formData.get('produceName') as string,
      origin: formData.get('origin') as string,
      plantingDate: formData.get('plantingDate') as string,
      harvestDate: formData.get('harvestDate') as string,
      itemCount: parseInt(formData.get('itemCount') as string),
      farmer: { id: user.id, name: user.email || 'Unknown Farmer' },
      certificates: [],
      history: [
        {
          status: 'Registered' as const,
          timestamp: new Date().toISOString(),
          location: formData.get('origin') as string,
          actor: user.email || 'Unknown Farmer',
        },
      ],
    };

    try {
      const newLot = await createProduceLot(newLotData);
      setLots(prevLots => [newLot, ...prevLots]);
      toast({ title: 'Success', description: 'New produce batch registered!' });
      (event.target as HTMLFormElement).reset();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to register produce batch.' });
      console.error(error);
    } finally {
      setFormSubmitting(false);
    }
  };
  
  const isWalletConnected = !!wallet.address;

  return (
    <div className="container mx-auto py-10 px-4 space-y-8">
      <h1 className="text-3xl font-bold font-headline">Farmer Dashboard</h1>
      
      {!isWalletConnected && (
         <Alert variant="destructive">
          <Wallet className="h-4 w-4" />
          <AlertTitle>Wallet Not Connected</AlertTitle>
          <AlertDescription>
            You must connect your wallet to register new produce batches on the blockchain.
            <Button onClick={connectWallet} variant="link" className="p-0 h-auto ml-2 text-destructive-foreground underline">Connect Wallet</Button>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><PlusCircle /> Register New Produce Batch</CardTitle>
          <CardDescription>Add a new lot of produce to the blockchain. Requires a connected wallet.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegisterProduce} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <fieldset disabled={!isWalletConnected || formSubmitting} className="contents">
              <div className="space-y-2">
                <Label htmlFor="produceName">Produce Name</Label>
                <Input id="produceName" name="produceName" placeholder="e.g., Organic Gala Apples" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="origin">Origin</Label>
                <Input id="origin" name="origin" placeholder="e.g., Sunny Orchard, WA" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plantingDate">Planting Date</Label>
                <Input id="plantingDate" name="plantingDate" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="harvestDate">Expected Harvest Date</Label>
                <Input id="harvestDate" name="harvestDate" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="itemCount">Items in Lot</Label>
                <Input id="itemCount" name="itemCount" type="number" placeholder="e.g., 1000" required />
              </div>
              <div className="flex items-end space-x-4 md:col-span-2">
                <Button type="submit" className="w-full md:w-auto" disabled={!isWalletConnected || formSubmitting}>
                  {formSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Register Batch
                </Button>
                <Button type="button" variant="outline" className="w-full md:w-auto" disabled={!isWalletConnected || formSubmitting}>
                  <Upload className="mr-2 h-4 w-4" /> Upload Certificates
                </Button>
              </div>
            </fieldset>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Produce Batches</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
             <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lot ID</TableHead>
                  <TableHead>Produce</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lots.map((lot) => (
                  <TableRow key={lot.id}>
                    <TableCell className="font-medium">{lot.id}</TableCell>
                    <TableCell>{lot.name}</TableCell>
                    <TableCell>{lot.itemCount}</TableCell>
                    <TableCell>{lot.history[lot.history.length - 1].status}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="icon">
                        <Link href={`/trace/${lot.id}`} title="View QR and Trace">
                          <QrCode className="h-5 w-5" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
