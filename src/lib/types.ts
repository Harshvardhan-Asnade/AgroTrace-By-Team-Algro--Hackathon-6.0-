
export type SmartContractInput = {
  produceDetails: string;
  trackingRequirements: string;
};

export type SmartContractOutput = {
  smartContractCode: string;
};

export type HistoryEvent = {
  status: string;
  timestamp: string;
  location: string;
  actor: string;
};

export type ProduceLot = {
  id: string;
  created_at: string;
  farmer_id: string;
  produce_name: string;
  origin: string;
  planting_date: string;
  harvest_date: string;
  items_in_lot: number;
  status: string;
  history: HistoryEvent[];
};
