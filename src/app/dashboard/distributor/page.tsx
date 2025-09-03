
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
import { Loader2, Package, CheckCircle, Truck } from 'lucide-react';
import { User } from '@supabase/supabase-js';

export default function DistributorDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [lots, setLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user && user.user_metadata.role !== 'distributor') {
      router.push('/unauthorized');
      return;
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function fetchData() {
      if (user) {
        setLoading(true);
        // Fetch lots that are in transit to distributor or received by them
        const incomingLots = await getLotsByStatus('In-Transit to Distributor');
        const receivedLots = await getLotsByStatus('Received by Distributor');
        setLots([...incomingLots, ...receivedLots]);
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  const handleReceiveLot = async (lotId: string) => {
    const actorName = user?.email || 'Distributor';
    const newHistoryEvent = {
      status: 'Received by Distributor',
      timestamp: new Date().toISOString(),
      location: 'Distributor Hub',
      actor: actorName,
    };
    const success = await updateLot(lotId, { status: 'Received by Distributor' }, newHistoryEvent);
    if (success) {
      toast({ title: 'Lot Received!', description: 'The lot status has been updated.' });
      setLots(lots.map(lot => lot.id === lotId ? { ...lot, status: 'Received by Distributor' } : lot));
    } else {
      toast({ variant: 'destructive', title: 'Update Failed', description: 'Could not update lot status.' });
    }
  };

  const handleTransferToRetailer = async (lotId: string) => {
    const actorName = user?.email || 'Distributor';
     const newHistoryEvent = {
      status: 'In-Transit to Retailer',
      timestamp: new Date().toISOString(),
      location: 'En route to Retailer',
      actor: actorName,
    };
    const success = await updateLot(lotId, { status: 'In-Transit to Retailer' }, newHistoryEvent);
    if (success) {
      toast({ title: 'Lot Transferred!', description: 'Lot is now in transit to the retailer.' });
      setLots(lots.filter(lot => lot.id !== lotId)); // Remove from this dashboard
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
          <CardTitle>Distributor Dashboard</CardTitle>
          <CardDescription>Manage incoming produce lots and transfer them to retailers.</CardDescription>
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
                    <TableCell className="font-mono">{lot.id.substring(0, 8)}...</TableCell>
                    <TableCell>{lot.produce_name}</TableCell>
                    <TableCell>{lot.items_in_lot.toLocaleString()}</TableCell>
                    <TableCell><Badge>{lot.status}</Badge></TableCell>
                    <TableCell className="space-x-2">
                       {lot.status === 'In-Transit to Distributor' && (
                        <Button size="sm" onClick={() => handleReceiveLot(lot.id)}><CheckCircle className="mr-2" /> Receive</Button>
                      )}
                      {lot.status === 'Received by Distributor' && (
                        <Button size="sm" onClick={() => handleTransferToRetailer(lot.id)}><Truck className="mr-2"/> Transfer to Retailer</Button>
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
