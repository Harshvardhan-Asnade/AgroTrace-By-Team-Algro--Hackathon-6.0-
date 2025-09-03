
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useWallet } from '@/lib/wallet';
import { useRouter } from 'next/navigation';
import { createProduceLot, getLotsForFarmer, Lot, updateLot } from '@/lib/database';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Loader2, PlusCircle, BarChart, Package, Truck, QrCode, Wallet, Leaf } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

// This would come from your contract's ABI
const contractABI: any[] = []; 
const contractAddress = "0x..."; // Your deployed contract address

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
  const { signer, address: walletAddress, connectWallet } = useWallet();
  const router = useRouter();
  const [lots, setLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<ProduceFormValues>({
    resolver: zodResolver(produceSchema),
    defaultValues: {
      produce_name: '',
      origin: '',
      planting_date: '',
      harvest_date: '',
      items_in_lot: 100,
    },
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
    if(user) {
      fetchFarmerLots();
    }
  }, [user]);

  // --- MOCK BLOCKCHAIN FUNCTIONS ---
  // Replace these with actual contract calls
  const mockMintBatch = async (values: ProduceFormValues): Promise<string> => {
      console.log("Simulating mintBatch transaction with data:", values);
      toast({ title: 'Simulating Transaction', description: 'Please confirm in your wallet (simulation).'});
      // Simulate a transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Generate a mock UUID - in a real scenario this comes from the contract event
      const mockBatchId = crypto.randomUUID();
      console.log("Simulated mint successful. Batch ID:", mockBatchId);
      toast({ title: 'Transaction Simulated', description: `Batch minted with ID: ${mockBatchId}` });
      return mockBatchId;
  };

  const mockTransferBatch = async (batchId: string, distributorAddress: string): Promise<boolean> => {
      console.log(`Simulating transferBatch for batch ${batchId} to ${distributorAddress}`);
      toast({ title: 'Simulating Transaction', description: 'Please confirm transfer in wallet (simulation).'});
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Simulated transfer successful.");
      toast({ title: 'Transfer Simulated', description: `Batch ${batchId} transferred.` });
      return true;
  };
  // --- END MOCK FUNCTIONS ---


  const onSubmit = async (values: ProduceFormValues) => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to register a batch.' });
      return;
    }
    if (!signer || !walletAddress) {
      toast({ variant: 'destructive', title: 'Wallet Not Connected', description: 'Please connect your wallet to register a batch.'});
      connectWallet();
      return;
    }
    setIsSubmitting(true);
    
    try {
      // 1. Blockchain Transaction (Simulated)
      const batchId = await mockMintBatch(values);


      // 2. Supabase DB Insert
      const lotData = {
        id: batchId,
        farmer_id: user.id,
        produce_name: values.produce_name,
        origin: values.origin,
        planting_date: values.planting_date,
        harvest_date: values.harvest_date,
        items_in_lot: values.items_in_lot,
      };

      const newLot = await createProduceLot(lotData);

      if (newLot) {
        toast({ title: 'Success', description: 'Produce batch registered on-chain and off-chain.' });
        fetchFarmerLots(); // Refresh the list
        form.reset();
        setOpenDialog(false);
      } else {
        // This error is now more meaningful because createProduceLot will log the specific Supabase error.
        throw new Error('Failed to save batch details to the database.');
      }
    } catch (error) {
       console.error("Error during batch registration:", error);
       toast({ variant: 'destructive', title: 'Registration Error', description: 'Failed to register the produce batch. Check the console for details.' });
    }

    setIsSubmitting(false);
  };
  
  const handleTransferToDistributor = async (lotId: string) => {
    if (!signer || !walletAddress) {
       toast({ variant: 'destructive', title: 'Wallet Not Connected', description: 'Please connect your wallet to transfer a batch.'});
       connectWallet();
       return;
    }

    try {
      // Here you would get the distributor's wallet address, e.g., from a form
      const mockDistributorAddress = "0xDISTRIBUTOR_ADDRESS...";

      // 1. Blockchain Transaction (Simulated)
      const success = await mockTransferBatch(lotId, mockDistributorAddress);
      if (!success) throw new Error("Blockchain transfer failed.");

      // 2. Supabase DB Update
      const actorName = walletAddress; // Use wallet address as actor
      const newHistoryEvent = {
        status: 'In-Transit to Distributor',
        timestamp: new Date().toISOString(),
        location: 'En route to Distributor',
        actor: actorName,
      };

      const dbSuccess = await updateLot(lotId, { status: 'In-Transit to Distributor' }, newHistoryEvent);
      if (dbSuccess) {
        toast({ title: 'Lot Transferred!', description: 'Lot is now in transit to the distributor.' });
        fetchFarmerLots(); // Refresh the list
      } else {
        throw new Error("Database update failed after transfer.");
      }
    } catch(error) {
      console.error("Error during transfer:", error);
      toast({ variant: 'destructive', title: 'Update Failed', description: 'Could not update lot status. See console for details.' });
    }
  };

  if (authLoading || loading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  const totalBatches = lots.length;
  const totalItems = lots.reduce((sum, lot) => sum + lot.items_in_lot, 0);
  const batchesInTransit = lots.filter(lot => lot.status === 'In-Transit to Distributor').length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };
  
  return (
    <motion.div 
      className="bg-muted/40 min-h-screen"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container mx-auto py-10 px-4">
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold font-headline">Farmer Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, manage your produce from here.</p>
          </div>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button size="lg" className="shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-0.5">
                <PlusCircle className="mr-2" /> Register New Batch
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
              <DialogHeader>
                <DialogTitle className="text-2xl">Register a New Produce Batch</DialogTitle>
                <DialogDescription>
                  This will mint a new batch on the blockchain. Ensure your wallet is connected.
                </DialogDescription>
              </DialogHeader>
              {!walletAddress && (
                <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed p-6 my-4 bg-muted/50">
                  <p className="text-muted-foreground text-center">Your wallet is not connected. Please connect it to proceed.</p>
                  <Button onClick={connectWallet}><Wallet className="mr-2 h-4 w-4"/>Connect Wallet</Button>
                </div>
              )}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  <div className="grid grid-cols-2 gap-4">
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
                  </div>
                   <FormField control={form.control} name="items_in_lot" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Items in Lot</FormLabel>
                      <FormControl><Input type="number" placeholder="e.g., 1000" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" disabled={isSubmitting || !walletAddress} className="w-full h-11 text-base">
                    {isSubmitting ? <Loader2 className="animate-spin" /> : 'Register Batch'}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </motion.div>

        <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Batches</CardTitle>
              <Package className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalBatches}</div>
              <p className="text-xs text-muted-foreground">batches registered</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <BarChart className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalItems.toLocaleString()}</div>
               <p className="text-xs text-muted-foreground">items across all batches</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Batches In Transit</CardTitle>
              <Truck className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{batchesInTransit}</div>
              <p className="text-xs text-muted-foreground">currently on the move</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>My Produce Batches</CardTitle>
              <CardDescription>A list of all your registered produce batches on the blockchain.</CardDescription>
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
                  {lots.length > 0 ? (
                    lots.map((lot) => (
                      <TableRow key={lot.id} className="hover:bg-muted/50">
                        <TableCell className="font-mono text-muted-foreground">{lot.id.substring(0, 8)}...</TableCell>
                        <TableCell className="font-medium">{lot.produce_name}</TableCell>
                        <TableCell>{lot.items_in_lot.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={lot.status === 'Registered' ? 'secondary' : 'default'} className="capitalize">
                            {lot.status.toLowerCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/trace/${lot.id}`}>Trace</Link>
                          </Button>
                          {lot.status === 'Registered' && (
                            <Button size="sm" onClick={() => handleTransferToDistributor(lot.id)}>
                              <Truck className="mr-2 h-4 w-4"/>
                              Transfer
                            </Button>
                          )}
                          <Button variant="ghost" size="icon">
                            <QrCode className="h-5 w-5 text-muted-foreground hover:text-foreground"/>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center h-48">
                        <div className="flex flex-col items-center justify-center gap-4">
                          <Leaf className="w-16 h-16 text-muted-foreground/30" />
                          <h3 className="text-xl font-semibold">No Batches Yet</h3>
                          <p className="text-muted-foreground">Click "Register New Batch" to get started.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
