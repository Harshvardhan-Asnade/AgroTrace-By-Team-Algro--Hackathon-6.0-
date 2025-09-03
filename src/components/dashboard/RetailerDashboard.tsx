'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { mockProduceLots } from '@/lib/mock-data';
import type { ProduceLot } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowRight, CheckCircle, QrCode, ShoppingCart, Truck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function RetailerDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [lots, setLots] = useState<ProduceLot[]>(mockProduceLots.filter(lot => 
    lot.history.some(h => h.status.includes('Retailer') || h.status.includes('Purchase'))
  ));

  const handleUpdateStatus = (lotId: string, newStatus: 'Received by Retailer' | 'Available for Purchase') => {
    setLots(prevLots => prevLots.map(lot => {
      if (lot.id === lotId) {
        const newHistory = [...lot.history, {
          status: newStatus,
          timestamp: new Date().toISOString(),
          location: 'Retail Store',
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

  const incomingShipments = lots.filter(lot => lot.history[lot.history.length - 1].status === 'In-Transit to Retailer');
  const inventory = lots.filter(lot => lot.history[lot.history.length-1].status === 'Received by Retailer');
  const forSale = lots.filter(lot => lot.history[lot.history.length-1].status === 'Available for Purchase');


  return (
    <div className="container mx-auto py-10 px-4 space-y-8">
      <h1 className="text-3xl font-bold font-headline">Retailer Dashboard</h1>
      
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
                  <TableCell>{lot.history.find(h => h.status === 'In-Transit to Retailer')?.actor}</TableCell>
                  <TableCell>{lot.name}</TableCell>
                  <TableCell className="text-right">
                    <Button onClick={() => handleUpdateStatus(lot.id, 'Received by Retailer')}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Accept into Stock
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

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ShoppingCart /> Current Stock</CardTitle>
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
                      <Button onClick={() => handleUpdateStatus(lot.id, 'Available for Purchase')} variant="outline">
                        Make Available
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">No items in stock.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><QrCode /> Customer QR Codes</CardTitle>
            <CardDescription>Display these QR codes for customers to trace their produce.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lot ID</TableHead>
                  <TableHead>Produce</TableHead>
                  <TableHead className="text-right">QR Code</TableHead>
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
                    <TableCell colSpan={3} className="text-center">No items available for sale.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Table>
        </CardContent>
        </Card>
      </div>
    </div>
  );
}
