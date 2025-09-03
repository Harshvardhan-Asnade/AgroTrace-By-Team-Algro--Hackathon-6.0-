export type SupplyChainStatus =
  | 'Registered'
  | 'In-Transit to Distributor'
  | 'Received by Distributor'
  | 'In-Transit to Retailer'
  | 'Received by Retailer'
  | 'Available for Purchase';

export type SupplyChainEvent = {
  status: SupplyChainStatus;
  timestamp: string;
  location: string;
  actor: string;
  notes?: string;
};

export type ProduceLot = {
  id: string;
  name: string;
  origin: string;
  plantingDate: string;
  harvestDate: string;
  itemCount: number;
  farmer: {
    id: string;
    name: string;
  };
  certificates: { name: string; url: string }[];
  history: SupplyChainEvent[];
};

export type UserRole = 'farmer' | 'distributor' | 'retailer' | 'admin' | null;
