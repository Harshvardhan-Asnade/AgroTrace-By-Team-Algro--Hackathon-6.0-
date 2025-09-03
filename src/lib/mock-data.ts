import type { ProduceLot } from './types';

export const mockProduceLots: ProduceLot[] = [
  {
    id: 'LOT-A1B2',
    name: 'Organic Gala Apples',
    origin: 'Sunny Orchard, WA',
    plantingDate: '2023-04-15',
    harvestDate: '2023-09-20',
    itemCount: 1000,
    farmer: { id: 'FARM001', name: 'Farmer Jane' },
    certificates: [{ name: 'USDA Organic', url: '#' }],
    history: [
      {
        status: 'Registered',
        timestamp: '2023-09-21T08:00:00Z',
        location: 'Sunny Orchard, WA',
        actor: 'Farmer Jane',
      },
      {
        status: 'In-Transit to Distributor',
        timestamp: '2023-09-21T10:00:00Z',
        location: 'On route to Fresh Logistics',
        actor: 'Farm Transport Inc.',
      },
      {
        status: 'Received by Distributor',
        timestamp: '2023-09-22T09:00:00Z',
        location: 'Fresh Logistics Hub, Boise, ID',
        actor: 'Fresh Logistics',
      },
      {
        status: 'In-Transit to Retailer',
        timestamp: '2023-09-23T11:00:00Z',
        location: 'On route to Green Grocer',
        actor: 'Fresh Logistics',
      },
      {
        status: 'Received by Retailer',
        timestamp: '2023-09-24T14:00:00Z',
        location: 'Green Grocer, Denver, CO',
        actor: 'Green Grocer',
      },
      {
        status: 'Available for Purchase',
        timestamp: '2023-09-25T08:00:00Z',
        location: 'Green Grocer, Denver, CO',
        actor: 'Green Grocer',
      },
    ],
  },
  {
    id: 'LOT-C3D4',
    name: 'Heirloom Tomatoes',
    origin: 'Valley Farms, CA',
    plantingDate: '2023-05-01',
    harvestDate: '2023-08-10',
    itemCount: 500,
    farmer: { id: 'FARM002', name: 'Farmer John' },
    certificates: [{ name: 'Non-GMO Project Verified', url: '#' }],
    history: [
      {
        status: 'Registered',
        timestamp: '2023-08-11T09:00:00Z',
        location: 'Valley Farms, CA',
        actor: 'Farmer John',
      },
      {
        status: 'In-Transit to Distributor',
        timestamp: '2023-08-11T12:00:00Z',
        location: 'On route to West Coast Distributors',
        actor: 'Valley Transport',
      },
      {
        status: 'Received by Distributor',
        timestamp: '2023-08-12T15:00:00Z',
        location: 'West Coast Distributors, LA, CA',
        actor: 'West Coast Distributors',
      },
    ],
  },
];

export const getLotById = (id: string): ProduceLot | undefined => {
  return mockProduceLots.find((lot) => lot.id.toUpperCase() === id.toUpperCase());
};
