

import { getLotById } from '@/lib/database';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { notFound } from 'next/navigation';
import { Tractor, Box, Warehouse, Store, CheckCircle, Calendar, Package, MapPin, User } from 'lucide-react';
import type { SupplyChainStatus } from '@/lib/types';

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
    <div className="bg-muted/40">
      <div className="container mx-auto py-12 md:py-20 px-4">
        <Card className="mb-8 shadow-lg w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-headline tracking-tight text-primary">{lot.produce_name}</CardTitle>
            <CardDescription>Lot ID: {lot.id}</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
            <div className="flex items-start gap-3"><MapPin className="text-primary h-5 w-5 mt-0.5"/> <div><p className="font-bold text-base">Origin</p><p className="text-muted-foreground">{lot.origin}</p></div></div>
            <div className="flex items-start gap-3"><User className="text-primary h-5 w-5 mt-0.5"/> <div><p className="font-bold text-base">Farmer</p><p className="text-muted-foreground">{lot.farmer.name}</p></div></div>
            <div className="flex items-start gap-3"><Package className="text-primary h-5 w-5 mt-0.5"/> <div><p className="font-bold text-base">Lot Size</p><p className="text-muted-foreground">{lot.items_in_lot.toLocaleString()} items</p></div></div>
            <div className="flex items-start gap-3"><Calendar className="text-primary h-5 w-5 mt-0.5"/> <div><p className="font-bold text-base">Planted</p><p className="text-muted-foreground">{new Date(lot.plantingDate).toLocaleDateString()}</p></div></div>
            <div className="flex items-start gap-3"><Calendar className="text-primary h-5 w-5 mt-0.5"/> <div><p className="font-bold text-base">Harvested</p><p className="text-muted-foreground">{new Date(lot.harvestDate).toLocaleDateString()}</p></div></div>
          </CardContent>
        </Card>
        
        <div className="w-full max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold font-headline mb-6 text-center">Supply Chain Journey</h2>
            <div className="relative border-l-2 border-primary/20 ml-3 md:ml-0 md:pl-4">
            {lot.history.map((event, index) => (
                <div key={index} className="mb-10 pl-8 md:pl-10 relative">
                <div className="absolute -left-[13px] top-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground ring-8 ring-muted/40">
                    {statusIcons[event.status]}
                </div>
                <div className="bg-card p-4 rounded-lg shadow-sm border border-border/50">
                  <p className="font-bold text-lg text-foreground">{event.status}</p>
                  <p className="text-sm text-muted-foreground">{new Date(event.timestamp).toLocaleString()}</p>
                  <div className="mt-2 text-sm space-y-1">
                      <p><span className="font-semibold">Actor:</span> {event.actor}</p>
                      <p><span className="font-semibold">Location:</span> {event.location}</p>
                  </div>
                </div>
                </div>
            ))}
            </div>
        </div>
      </div>
    </div>
  );
}
