
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tractor, Box, Warehouse, Store, CheckCircle, Calendar, Package, MapPin, User } from 'lucide-react';
import type { ReactNode } from 'react';

type SupplyChainStatus =
  | 'Registered'
  | 'In-Transit to Distributor'
  | 'Received by Distributor'
  | 'In-Transit to Retailer'
  | 'Received by Retailer'
  | 'Available for Purchase';

const statusIcons: Record<SupplyChainStatus, ReactNode> = {
  'Registered': <Tractor className="h-5 w-5" />,
  'In-Transit to Distributor': <Box className="h-5 w-5" />,
  'Received by Distributor': <Warehouse className="h-5 w-5" />,
  'In-Transit to Retailer': <Box className="h-5 w-5" />,
  'Received by Retailer': <Store className="h-5 w-5" />,
  'Available for Purchase': <CheckCircle className="h-5 w-5" />,
};

const staticLot = {
    id: "LOT-DEMO123",
    produce_name: "Organic Gala Apples",
    origin: "Sunny Orchard, WA",
    farmer: { name: "John Appleseed" },
    items_in_lot: 1000,
    plantingDate: "2024-03-15",
    harvestDate: "2024-09-01",
    history: [
        { status: 'Registered' as const, timestamp: "2024-09-01T08:00:00Z", location: "Sunny Orchard, WA", actor: "John Appleseed" },
        { status: 'In-Transit to Distributor' as const, timestamp: "2024-09-02T10:00:00Z", location: "En route", actor: "John Appleseed" },
        { status: 'Received by Distributor' as const, timestamp: "2024-09-03T11:00:00Z", location: "Distributor Hub", actor: "Fresh Produce Inc." },
        { status: 'In-Transit to Retailer' as const, timestamp: "2024-09-04T09:00:00Z", location: "En route", actor: "Fresh Produce Inc." },
        { status: 'Received by Retailer' as const, timestamp: "2024-09-04T14:00:00Z", location: "GrocerMart", actor: "GrocerMart Staff" },
        { status: 'Available for Purchase' as const, timestamp: "2024-09-05T08:00:00Z", location: "GrocerMart", actor: "GrocerMart Staff" },
    ]
};


export default function TraceLotPage() {
  const lot = staticLot;

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
