
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { getLotsByStatus, updateLotHistory, refreshSchemaCache } from '@/lib/database';
import type { ProduceLot } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowRight, CheckCircle, Truck, Loader2, Package, Warehouse } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';

export default function DistributorDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [incomingShipments, setIncomingShipments] = useState<ProduceLot[]>([]);
  const [inventory, setInventory] = useState<ProduceLot[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingLot, setUpdatingLot] = useState<string | null>(null);

  const fetchLots = async () => {
    await refreshSchemaCache();
    const [incoming, inInventory] = await Promise.all([
      getLotsByStatus(['In-Transit to Distributor']),
      getLotsByStatus(['Received by Distributor']),
    ]);
    setIncomingShipments(incoming);
    setInventory(inInventory);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchLots();
  }, []);

  const handleUpdateStatus = async (lotId: string, newStatus: 'Received by Distributor' | 'In-Transit to Retailer') => {
    if (!user?.email) return;
    setUpdatingLot(lotId);
    try {
      const newEvent = {
        status: newStatus,
        timestamp: new Date().toISOString(),
        location: newStatus === 'Received by Distributor' ? 'Distributor Hub' : 'En route to Retailer',
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

  const stats = {
    incomingCount: incomingShipments.length,
    inventoryCount: inventory.length,
    inventoryValue: inventory.reduce((acc, lot) => acc + lot.itemCount, 0),
  };

  if (loading) {
    return (
        <div className="container mx-auto py-10 px-4 space-y-8">
            <Skeleton className="h-10 w-1/3" />
            <div className="grid gap-4 md:grid-cols-3">
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
            </div>
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
        </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4 space-y-8">
      <h1 className="text-4xl font-bold font-headline tracking-tight">Distributor Dashboard</h1>

       <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incoming Shipments</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.incomingCount}</div>
            <p className="text-xs text-muted-foreground">batches on the way</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Batches</CardTitle>
            <Warehouse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inventoryCount}</div>
            <p className="text-xs text-muted-foreground">batches in your warehouse</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inventoryValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">items currently in stock</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Truck /> Incoming Shipments</CardTitle>
          <CardDescription>These batches are in-transit to your facility. Please verify upon receipt.</CardDescription>
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
                    <TableCell>{lot.farmer.name}</TableCell>
                    <TableCell>{lot.name}</TableCell>
                    <TableCell>{lot.itemCount.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Button onClick={() => handleUpdateStatus(lot.id, 'Received by Distributor')} disabled={updatingLot === lot.id}>
                         {updatingLot === lot.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                        Verify & Receive
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

      <Card>
        <CardHeader>
          <CardTitle>Current Inventory</CardTitle>
           <CardDescription>Batches currently stored in your warehouse, ready for shipment to retailers.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lot ID</TableHead>
                  <TableHead>Produce</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Received</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventory.length > 0 ? inventory.map((lot) => (
                  <TableRow key={lot.id}>
                    <TableCell className="font-medium">{lot.id}</TableCell>
                    <TableCell>{lot.name}</TableCell>
                    <TableCell>{lot.itemCount.toLocaleString()}</TableCell>
                    <TableCell>{new Date(lot.history.find(h => h.status === 'Received by Distributor')?.timestamp || '').toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button onClick={() => handleUpdateStatus(lot.id, 'In-Transit to Retailer')} variant="outline" disabled={updatingLot === lot.id}>
                        {updatingLot === lot.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Transfer to Retailer
                        {updatingLot !== lot.id && <ArrowRight className="ml-2 h-4 w-4" />}
                      </Button>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">Inventory is empty.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}

