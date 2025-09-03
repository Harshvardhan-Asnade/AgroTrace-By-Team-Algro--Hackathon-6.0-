
'use server';
import { supabase } from './supabaseClient';
import type { ProduceLot } from './types';
export type { ProduceLot as Lot };

// Function to get lots by their status
export async function getLotsByStatus(status: string): Promise<ProduceLot[]> {
  const { data, error } = await supabase
    .from('batches')
    .select('*')
    .eq('status', status);

  if (error) {
    console.error(`Error fetching lots with status ${status}:`, error);
    return [];
  }
  return data || [];
}

// Function to get all lots for a specific farmer
export async function getLotsForFarmer(farmerId: string): Promise<ProduceLot[]> {
  const { data, error } = await supabase
    .from('batches')
    .select('*')
    .eq('farmer_id', farmerId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching farmer lots:', error);
    return [];
  }
  return data || [];
}

// Function to get a single lot by its ID
export async function getLotById(lotId: string): Promise<ProduceLot | null> {
  const { data, error } = await supabase
    .from('batches')
    .select('*')
    .eq('id', lotId)
    .single();

  if (error) {
    console.error('Error fetching lot by ID:', error);
    return null;
  }
  return data;
}

// Function to create a new produce lot
export async function createProduceLot(lotData: {
    id: string; // From blockchain
    farmer_id: string; // From auth user
    produce_name: string;
    origin: string;
    planting_date: string;
    harvest_date: string;
    items_in_lot: number;
}): Promise<ProduceLot | null> {
  const initialHistory = [{
    status: 'Registered',
    timestamp: new Date().toISOString(),
    location: lotData.origin,
    actor: lotData.farmer_id // Use farmer's ID as the initial actor
  }];

  const payload = {
    ...lotData,
    status: 'Registered',
    history: initialHistory,
  };

  const { data, error } = await supabase
    .from('batches')
    .insert([payload])
    .select()
    .single();

  if (error) {
    // This will now log the specific Supabase error to the server console
    console.error('Error creating produce lot in Supabase:', error.message);
    return null;
  }
  
  return data;
}

// Function to update a lot's status and history
export async function updateLot(lotId: string, updates: Partial<ProduceLot>, newHistoryEvent: any): Promise<boolean> {
  const lot = await getLotById(lotId);
  if (!lot) return false;

  const updatedHistory = [...(lot.history || []), newHistoryEvent];

  const { error } = await supabase
    .from('batches')
    .update({ ...updates, history: updatedHistory })
    .eq('id', lotId);

  if (error) {
    console.error('Error updating lot:', error);
    return false;
  }
  return true;
}
