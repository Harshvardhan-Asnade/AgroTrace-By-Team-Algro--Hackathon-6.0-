'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { mockProduceLots } from '@/lib/mock-data';
import type { ProduceLot } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowRight, CheckCircle, Truck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function DistributorDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  // Simulating lots that are in-transit to or received by any distributor
  const [lots, setLots] = useState<ProduceLot[]>(mockProduceLots.filter(lot => 
    lot.history.some(h => h.status.includes('Distributor'))
  ));

  const handleUpdateStatus = (lotId: string, newStatus: 'Received by Distributor' | 'In-Transit to Retailer') => {
    setLots(prevLots => prevLots.map(lot => {
      if (lot.id === lotId) {
        const newHistory = [...lot.history, {
          status: newStatus,
          timestamp: new Date().toISOString(),
          location: newStatus === 'Received by Distributor' ? 'Distributor Hub' : 'En route to Retailer',
          actor: user!.name,
        }];
        return { ...lot, history: newHistory };
      }
      return lot;
    }));
    toast({
      title: 'Status Updated',
      description: `Lot ${lotId} has been updated to "${newStatus}".`
    });
  };

  const incomingShipments = lots.filter(lot => lot.history[lot.history.length-1].status === 'In-Transit to Distributor');
  const inventory = lots.filter(lot => lot.history[lot.history.length-1].status === 'Received by Distributor');

  return (
    <div className="container mx-auto py-10 px-4 space-y-8">
      <h1 className="text-3xl font-bold font-headline">Distributor Dashboard</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Truck /> Incoming Shipments</CardTitle>
        </CardHeader>
        <CardContent>
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
                    <Button onClick={() => handleUpdateStatus(lot.id, 'Received by Distributor')}>
                      <CheckCircle className="mr-2 h-4 w-4" />
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Inventory</CardTitle>
        </CardHeader>
        <CardContent>
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
                    <Button onClick={() => handleUpdateStatus(lot.id, 'In-Transit to Retailer')} variant="outline">
                      Transfer to Retailer
                      <ArrowRight className="ml-2 h-4 w-4" />
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
        </CardContent>
      </Card>
    </div>
  );
}
