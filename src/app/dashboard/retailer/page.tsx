
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { getLotsByStatus, updateLot, Lot } from '@/lib/database';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, ShoppingCart } from 'lucide-react';

export default function RetailerDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [lots, setLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user && user.user_metadata.role !== 'retailer') {
      router.push('/unauthorized');
      return;
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function fetchData() {
      if (user) {
        setLoading(true);
        const incomingLots = await getLotsByStatus('In-Transit to Retailer');
        const receivedLots = await getLotsByStatus('Received by Retailer');
        setLots([...incomingLots, ...receivedLots]);
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  const handleReceiveLot = async (lotId: string) => {
    const actorName = user?.email || 'Retailer';
    const newHistoryEvent = {
      status: 'Received by Retailer',
      timestamp: new Date().toISOString(),
      location: 'Retail Store',
      actor: actorName,
    };
    const success = await updateLot(lotId, { status: 'Received by Retailer' }, newHistoryEvent);
    if (success) {
      toast({ title: 'Lot Received!', description: 'The lot status has been updated.' });
      setLots(lots.map(lot => lot.id === lotId ? { ...lot, status: 'Received by Retailer' } : lot));
    } else {
      toast({ variant: 'destructive', title: 'Update Failed', description: 'Could not update lot status.' });
    }
  };

  const handleMarkForSale = async (lotId: string) => {
     const actorName = user?.email || 'Retailer';
     const newHistoryEvent = {
      status: 'Available for Purchase',
      timestamp: new Date().toISOString(),
      location: 'Retail Store',
      actor: actorName,
    };
    const success = await updateLot(lotId, { status: 'Available for Purchase' }, newHistoryEvent);
    if (success) {
      toast({ title: 'Marked for Sale!', description: 'Lot is now available for customers.' });
      setLots(lots.filter(lot => lot.id !== lotId));
    } else {
      toast({ variant: 'destructive', title: 'Update Failed', description: 'Could not update lot status.' });
    }
  };

  if (authLoading || loading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Retailer Dashboard</CardTitle>
          <CardDescription>Manage incoming stock and mark it as available for purchase.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lot ID</TableHead>
                <TableHead>Produce Name</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lots.length > 0 ? (
                lots.map((lot) => (
                  <TableRow key={lot.id}>
                    <TableCell className="font-mono">{lot.id}</TableCell>
                    <TableCell>{lot.produce_name}</TableCell>
                    <TableCell>{lot.items_in_lot.toLocaleString()}</TableCell>
                    <TableCell><Badge>{lot.status}</Badge></TableCell>
                    <TableCell className="space-x-2">
                       {lot.status === 'In-Transit to Retailer' && (
                        <Button size="sm" onClick={() => handleReceiveLot(lot.id)}><CheckCircle className="mr-2" /> Receive</Button>
                      )}
                      {lot.status === 'Received by Retailer' && (
                        <Button size="sm" onClick={() => handleMarkForSale(lot.id)}><ShoppingCart className="mr-2"/> Mark for Sale</Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">No lots require your attention.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
