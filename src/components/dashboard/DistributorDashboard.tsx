
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { getLotsByStatus, updateLotHistory, refreshSchemaCache } from '@/lib/database';
import type { ProduceLot } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowRight, CheckCircle, Truck, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';

export default function DistributorDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [incomingShipments, setIncomingShipments] = useState<ProduceLot[]>([]);
  const [inventory, setInventory] = useState<ProduceLot[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingLot, setUpdatingLot] = useState<string | null>(null);

  useEffect(() => {
    const fetchLots = async () => {
      setLoading(true);
      await refreshSchemaCache();
      const [incoming, inInventory] = await Promise.all([
        getLotsByStatus(['In-Transit to Distributor']),
        getLotsByStatus(['Received by Distributor']),
      ]);
      setIncomingShipments(incoming);
      setInventory(inInventory);
      setLoading(false);
    };

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
      // Refetch all lots to ensure UI is consistent
      const fetchLots = async () => {
        setLoading(true);
        await refreshSchemaCache();
        const [incoming, inInventory] = await Promise.all([
          getLotsByStatus(['In-Transit to Distributor']),
          getLotsByStatus(['Received by Distributor']),
        ]);
        setIncomingShipments(incoming);
        setInventory(inInventory);
        setLoading(false);
      };
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

  return (
    <div className="container mx-auto py-10 px-4 space-y-8">
      <h1 className="text-3xl font-bold font-headline">Distributor Dashboard</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Truck /> Incoming Shipments</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? <Skeleton className="h-24 w-full" /> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lot ID</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>Produce</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incomingShipments.length > 0 ? incomingShipments.map((lot) => (
                  <TableRow key={lot.id}>
                    <TableCell className="font-medium">{lot.id}</TableCell>
                    <TableCell>{lot.farmer.name}</TableCell>
                    <TableCell>{lot.name}</TableCell>
                    <TableCell className="text-right">
                      <Button onClick={() => handleUpdateStatus(lot.id, 'Received by Distributor')} disabled={updatingLot === lot.id}>
                         {updatingLot === lot.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                        Verify & Receive
                      </Button>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">No incoming shipments.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Inventory</CardTitle>
        </CardHeader>
        <CardContent>
           {loading ? <Skeleton className="h-24 w-full" /> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lot ID</TableHead>
                  <TableHead>Produce</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventory.length > 0 ? inventory.map((lot) => (
                  <TableRow key={lot.id}>
                    <TableCell className="font-medium">{lot.id}</TableCell>
                    <TableCell>{lot.name}</TableCell>
                    <TableCell>{lot.itemCount}</TableCell>
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
                    <TableCell colSpan={4} className="text-center">Inventory is empty.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
