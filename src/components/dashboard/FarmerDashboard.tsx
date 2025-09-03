'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { mockProduceLots } from '@/lib/mock-data';
import type { ProduceLot } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { QrCode, PlusCircle, Upload, Wallet } from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function FarmerDashboard() {
  const { user, wallet, connectWallet } = useAuth();
  const [lots, setLots] = useState<ProduceLot[]>(mockProduceLots.filter(lot => lot.farmer.id === 'FARM001'));

  const handleRegisterProduce = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!wallet.address) {
      // This should ideally be handled by disabling the form, but as a fallback:
      alert("Please connect your wallet to register a batch.");
      return;
    }
    const formData = new FormData(event.currentTarget);
    const newLot: ProduceLot = {
      id: `LOT-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      name: formData.get('produceName') as string,
      origin: formData.get('origin') as string,
      plantingDate: formData.get('plantingDate') as string,
      harvestDate: formData.get('harvestDate') as string,
      itemCount: parseInt(formData.get('itemCount') as string),
      farmer: { id: user!.role === 'farmer' ? 'FARM001' : '', name: user!.name },
      certificates: [],
      history: [
        {
          status: 'Registered',
          timestamp: new Date().toISOString(),
          location: formData.get('origin') as string,
          actor: user!.name,
        },
      ],
    };
    setLots(prevLots => [newLot, ...prevLots]);
    (event.target as HTMLFormElement).reset();
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
            <fieldset disabled={!isWalletConnected} className="contents">
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
                <Button type="submit" className="w-full md:w-auto" disabled={!isWalletConnected}>Register Batch</Button>
                <Button type="button" variant="outline" className="w-full md:w-auto" disabled={!isWalletConnected}><Upload className="mr-2 h-4 w-4" /> Upload Certificates</Button>
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
        </CardContent>
      </Card>
    </div>
  );
}
