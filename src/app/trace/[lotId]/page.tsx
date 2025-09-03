

import { getLotById } from '@/lib/database';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { notFound } from 'next/navigation';
import { Tractor, Box, Warehouse, Store, CheckCircle, Calendar, Package, MapPin, FileText, User, MessageSquare } from 'lucide-react';
import type { SupplyChainStatus } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const statusIcons: Record<SupplyChainStatus, React.ReactNode> = {
  'Registered': <Tractor className="h-5 w-5" />,
  'In-Transit to Distributor': <Box className="h-5 w-5" />,
  'Received by Distributor': <Warehouse className="h-5 w-5" />,
  'In-Transit to Retailer': <Box className="h-5 w-5" />,
  'Received by Retailer': <Store className="h-5 w-5" />,
  'Available for Purchase': <CheckCircle className="h-5 w-5" />,
};

// Make sure this page is dynamically rendered
export const dynamic = 'force-dynamic';

export default async function TraceLotPage({ params }: { params: { lotId: string } }) {
  const lot = await getLotById(params.lotId);

  if (!lot) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">{lot.name}</CardTitle>
          <CardDescription>Lot ID: {lot.id}</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <div className="flex items-center gap-2"><MapPin className="text-primary h-5 w-5"/> <div><p className="font-bold">Origin</p><p>{lot.origin}</p></div></div>
          <div className="flex items-center gap-2"><Calendar className="text-primary h-5 w-5"/> <div><p className="font-bold">Planted</p><p>{new Date(lot.plantingDate).toLocaleDateString()}</p></div></div>
          <div className="flex items-center gap-2"><Calendar className="text-primary h-5 w-5"/> <div><p className="font-bold">Harvested</p><p>{new Date(lot.harvestDate).toLocaleDateString()}</p></div></div>
          <div className="flex items-center gap-2"><Package className="text-primary h-5 w-5"/> <div><p className="font-bold">Lot Size</p><p>{lot.itemCount} items</p></div></div>
          <div className="flex items-center gap-2"><User className="text-primary h-5 w-5"/> <div><p className="font-bold">Farmer</p><p>{lot.farmer.name}</p></div></div>
          {lot.certificates && lot.certificates.length > 0 && (
            <div className="flex items-center gap-2"><FileText className="text-primary h-5 w-5"/> <div><p className="font-bold">Certificates</p><p>{lot.certificates.map(c => c.name).join(', ')}</p></div></div>
          )}
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
            <h2 className="text-2xl font-bold font-headline mb-6">Supply Chain Journey</h2>
            <div className="relative border-l-2 border-primary/20 pl-6 space-y-8">
            {lot.history.map((event, index) => (
                <div key={index} className="relative">
                <div className="absolute -left-[35px] top-1.5 h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                    {statusIcons[event.status]}
                </div>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                    <CardTitle className="text-lg">{event.status}</CardTitle>
                    <CardDescription>{new Date(event.timestamp).toLocaleString()}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm space-y-1">
                    <p><span className="font-semibold">Actor:</span> {event.actor}</p>
                    <p><span className="font-semibold">Location:</span> {event.location}</p>
                    </CardContent>
                </Card>
                </div>
            ))}
            </div>
        </div>
        <div>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><MessageSquare /> Leave Feedback</CardTitle>
                    <CardDescription>Share your experience with this product.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="feedback">Your Feedback</Label>
                        <Textarea id="feedback" placeholder="How was the quality? Let us know!" />
                    </div>
                    <Button className="w-full">Submit Feedback</Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
