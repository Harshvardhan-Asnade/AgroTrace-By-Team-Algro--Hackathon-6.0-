
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { createProduceLot, getLotsForFarmer, Lot } from '@/lib/database';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Loader2, PlusCircle, BarChart, Package, Truck, QrCode } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { updateLot } from '@/lib/database';


const produceSchema = z.object({
  produce_name: z.string().min(1, 'Produce name is required'),
  origin: z.string().min(1, 'Origin is required'),
  planting_date: z.string().min(1, 'Planting date is required'),
  harvest_date: z.string().min(1, 'Harvest date is required'),
  items_in_lot: z.coerce.number().min(1, 'Items in lot must be at least 1'),
});

type ProduceFormValues = z.infer<typeof produceSchema>;

export default function FarmerDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [lots, setLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<ProduceFormValues>({
    resolver: zodResolver(produceSchema),
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user && user.user_metadata.role !== 'farmer') {
      router.push('/unauthorized');
      return;
    }
  }, [user, authLoading, router]);

  const fetchFarmerLots = async () => {
    if (user) {
      setLoading(true);
      const farmerLots = await getLotsForFarmer(user.id);
      setLots(farmerLots);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmerLots();
  }, [user]);

  const handleRegisterProduce = async (values: ProduceFormValues) => {
    if (!user) return;
    setIsSubmitting(true);
    
    const lotData: Omit<Lot, 'id' | 'status' | 'history'> = {
      ...values,
      farmer_id: user.id,
    };

    const newLot = await createProduceLot(lotData);
    if (newLot) {
      toast({ title: 'Success', description: 'Produce batch registered successfully.' });
      setLots([newLot, ...lots]);
      form.reset();
      // Close dialog if it's open
    } else {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to register produce.' });
    }
    setIsSubmitting(false);
  };
  
  const handleTransferToDistributor = async (lotId: string) => {
    const actorName = user?.email || 'Farmer';
    const newHistoryEvent = {
      status: 'In-Transit to Distributor',
      timestamp: new Date().toISOString(),
      location: 'En route to Distributor',
      actor: actorName,
    };

    const success = await updateLot(lotId, { status: 'In-Transit to Distributor' }, newHistoryEvent);
    if (success) {
      toast({ title: 'Lot Transferred!', description: 'Lot is now in transit to the distributor.' });
      fetchFarmerLots(); // Re-fetch lots to update status
    } else {
      toast({ variant: 'destructive', title: 'Update Failed', description: 'Could not update lot status.' });
    }
  };

  const totalBatches = lots.length;
  const totalItems = lots.reduce((sum, lot) => sum + lot.items_in_lot, 0);
  const batchesInTransit = lots.filter(lot => lot.status === 'In-Transit to Distributor').length;

  if (authLoading || loading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-headline">Farmer Dashboard</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button><PlusCircle className="mr-2" /> Register New Batch</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Register a New Produce Batch</DialogTitle>
              <DialogDescription>Fill in the details below to create a new lot on the blockchain.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleRegisterProduce)} className="space-y-4">
                <FormField control={form.control} name="produce_name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Produce Name</FormLabel>
                    <FormControl><Input placeholder="e.g., Organic Gala Apples" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                 <FormField control={form.control} name="origin" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Origin</FormLabel>
                    <FormControl><Input placeholder="e.g., Sunny Orchard, WA" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="planting_date" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Planting Date</FormLabel>
                    <FormControl><Input type="date" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                 <FormField control={form.control} name="harvest_date" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Harvest Date</FormLabel>
                    <FormControl><Input type="date" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                 <FormField control={form.control} name="items_in_lot" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Items in Lot</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 1000" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? <Loader2 className="animate-spin" /> : 'Register Batch'}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Batches</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBatches}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Batches In Transit</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{batchesInTransit}</div>
          </CardContent>
        </Card>
      </div>

      {/* Batches Table */}
      <Card>
        <CardHeader>
          <CardTitle>My Produce Batches</CardTitle>
          <CardDescription>A list of all your registered produce batches.</CardDescription>
        </CardHeader>
        <CardContent>
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lot ID</TableHead>
                <TableHead>Produce</TableHead>
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
                    <TableCell>
                      <Badge variant={lot.status === 'Registered' ? 'secondary' : 'default'}>{lot.status}</Badge>
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Button variant="outline" size="sm" asChild><Link href={`/trace/${lot.id}`}>Trace</Link></Button>
                      {lot.status === 'Registered' && (
                        <Button size="sm" onClick={() => handleTransferToDistributor(lot.id)}>Transfer</Button>
                      )}
                      <Button variant="ghost" size="icon"><QrCode/></Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    You haven’t registered any batches yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
