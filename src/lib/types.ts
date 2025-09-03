
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
  produce_name: string;
  origin: string;
  plantingDate: string;
  harvestDate: string;
  items_in_lot: number;
  farmer: {
    id: string;
    name: string;
  };
  history: SupplyChainEvent[];
};

export type UserRole = 'farmer' | 'distributor' | 'retailer' | 'admin' | null;
