
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { getLotsByStatus, updateLotHistory, refreshSchemaCache } from '@/lib/database';
import type { ProduceLot, SupplyChainEvent } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowRight, CheckCircle, QrCode, ShoppingCart, Truck, Loader2, Store } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Skeleton } from '../ui/skeleton';

export default function RetailerDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [incomingShipments, setIncomingShipments] = useState<ProduceLot[]>([]);
  const [inventory, setInventory] = useState<ProduceLot[]>([]);
  const [forSale, setForSale] = useState<ProduceLot[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingLot, setUpdatingLot] = useState<string | null>(null);

  const fetchLots = async () => {
    await refreshSchemaCache();
    const [incoming, inInventory, onSale] = await Promise.all([
      getLotsByStatus(['In-Transit to Retailer']),
      getLotsByStatus(['Received by Retailer']),
      getLotsByStatus(['Available for Purchase']),
    ]);
    setIncomingShipments(incoming);
    setInventory(inInventory);
    setForSale(onSale);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchLots();
  }, []);

  const handleUpdateStatus = async (lotId: string, newStatus: 'Received by Retailer' | 'Available for Purchase') => {
    if (!user?.email) return;
    setUpdatingLot(lotId);
    try {
      const newEvent: SupplyChainEvent = {
        status: newStatus,
        timestamp: new Date().toISOString(),
        location: 'Retail Store',
        actor: user.email,
      };
      await updateLotHistory(lotId, newEvent);
      toast({
        title: 'Status Updated',
        description: `Lot ${lotId} has been updated to "${newStatus}".`
      });
      await fetchLots();
    } catch (error: any) {
       toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error.message || `Could not update lot ${lotId}. Please try again.`,
      });
    } finally {
      setUpdatingLot(null);
    }
  };

  const getPreviousActor = (lot: ProduceLot): string => {
    const transitEventIndex = lot.history.findIndex(e => e.status === 'In-Transit to Retailer');
    if (transitEventIndex > 0) {
      return lot.history[transitEventIndex - 1].actor;
    }
    return 'Distributor'; // Fallback
  }

  const stats = {
    incomingCount: incomingShipments.length,
    stockCount: inventory.length,
    forSaleCount: forSale.length,
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
            <Skeleton className="h-64" />
            <div className="grid md:grid-cols-2 gap-8">
                <Skeleton className="h-64" />
                <Skeleton className="h-64" />
            </div>
        </div>
    )
  }
  
  return (
    <div className="container mx-auto py-10 px-4 space-y-8">
      <h1 className="text-4xl font-bold font-headline tracking-tight">Retailer Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incoming Deliveries</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.incomingCount}</div>
            <p className="text-xs text-muted-foreground">batches on the way</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Batches in Stock</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.stockCount}</div>
            <p className="text-xs text-muted-foreground">batches awaiting placement</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Items for Sale</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.forSaleCount}</div>
            <p className="text-xs text-muted-foreground">batches on customer shelves</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Truck /> Incoming Deliveries</CardTitle>
          <CardDescription>These batches are in-transit to your store. Please verify upon receipt.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lot ID</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>Produce</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incomingShipments.length > 0 ? incomingShipments.map((lot) => (
                  <TableRow key={lot.id}>
                    <TableCell className="font-medium">{lot.id}</TableCell>
                    <TableCell>{getPreviousActor(lot)}</TableCell>
                    <TableCell>{lot.name}</TableCell>
                    <TableCell>{lot.itemCount.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Button onClick={() => handleUpdateStatus(lot.id, 'Received by Retailer')} disabled={updatingLot === lot.id}>
                         {updatingLot === lot.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                        Accept into Stock
                      </Button>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">No incoming shipments.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ShoppingCart /> In-Stock Inventory</CardTitle>
            <CardDescription>Items received but not yet available for purchase.</CardDescription>
          </CardHeader>
          <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lot ID</TableHead>
                    <TableHead>Produce</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.length > 0 ? inventory.map((lot) => (
                    <TableRow key={lot.id}>
                      <TableCell className="font-medium">{lot.id}</TableCell>
                      <TableCell>{lot.name}</TableCell>
                      <TableCell className="text-right">
                        <Button onClick={() => handleUpdateStatus(lot.id, 'Available for Purchase')} variant="outline" disabled={updatingLot === lot.id}>
                          {updatingLot === lot.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Make Available
                          {updatingLot !== lot.id && <ArrowRight className="ml-2 h-4 w-4" />}
                        </Button>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center">No items in stock.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><QrCode /> Ready for Purchase</CardTitle>
            <CardDescription>Items available for customers. Click the icon to view the trace page.</CardDescription>
          </CardHeader>
          <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lot ID</TableHead>
                    <TableHead>Produce</TableHead>
                    <TableHead className="text-right">Trace Page</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {forSale.length > 0 ? forSale.map((lot) => (
                    <TableRow key={lot.id}>
                      <TableCell className="font-medium">{lot.id}</TableCell>
                      <TableCell>{lot.name}</TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="ghost" size="icon">
                          <Link href={`/trace/${lot.id}`} title="View QR and Trace">
                            <QrCode className="h-5 w-5" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center">No items available for sale.</TableCell>
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
