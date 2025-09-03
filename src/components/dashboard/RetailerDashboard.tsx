
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { getLotsByStatus, updateLotHistory } from '@/lib/database';
import type { ProduceLot, SupplyChainEvent } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowRight, CheckCircle, QrCode, ShoppingCart, Truck, Loader2 } from 'lucide-react';
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

  useEffect(() => {
    const fetchLots = async () => {
      setLoading(true);
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
      const updatedLot = await updateLotHistory(lotId, newEvent);

      if (updatedLot) {
        if (newStatus === 'Received by Retailer') {
          setIncomingShipments(prev => prev.filter(lot => lot.id !== lotId));
          setInventory(prev => [updatedLot, ...prev]);
        } else {
          setInventory(prev => prev.filter(lot => lot.id !== lotId));
          setForSale(prev => [updatedLot, ...prev]);
        }
        toast({
          title: 'Status Updated',
          description: `Lot ${lotId} has been updated to "${newStatus}".`
        });
      }
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
    const lastEvent = lot.history.slice(-1)[0];
    if (lastEvent?.status === 'In-Transit to Retailer') {
      return lastEvent.actor;
    }
    return 'Distributor'; // Fallback
  }
  
  return (
    <div className="container mx-auto py-10 px-4 space-y-8">
      <h1 className="text-3xl font-bold font-headline">Retailer Dashboard</h1>
      
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
                    <TableCell>{getPreviousActor(lot)}</TableCell>
                    <TableCell>{lot.name}</TableCell>
                    <TableCell className="text-right">
                      <Button onClick={() => handleUpdateStatus(lot.id, 'Received by Retailer')} disabled={updatingLot === lot.id}>
                         {updatingLot === lot.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
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
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ShoppingCart /> Current Stock</CardTitle>
          </CardHeader>
          <CardContent>
             {loading ? <Skeleton className="h-24 w-full" /> : (
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
                      <TableCell colSpan={3} className="text-center">No items in stock.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><QrCode /> Customer QR Codes</CardTitle>
            <CardDescription>Display these QR codes for customers to trace their produce.</CardDescription>
          </CardHeader>
          <CardContent>
             {loading ? <Skeleton className="h-24 w-full" /> : (
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
