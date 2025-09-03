
'use server';
import { supabase } from './supabaseClient';
import type { ProduceLot } from './types';
export type { ProduceLot as Lot };

// Helper to force-refresh the schema cache.
async function refreshSchemaCache() {
  try {
    const { error } = await supabase.rpc('pgrst_watch');
    if (error) {
      console.error('Error refreshing schema cache:', error);
    } else {
      console.log('Schema cache refreshed successfully.');
    }
  } catch(e) {
    console.error('Caught error refreshing schema cache:', e);
  }
}

// Function to get lots by their status
export async function getLotsByStatus(status: string): Promise<ProduceLot[]> {
  await refreshSchemaCache();
  const { data, error } = await supabase
    .from('produce_batches')
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
  await refreshSchemaCache();
  const { data, error } = await supabase
    .from('produce_batches')
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
    .from('produce_batches')
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
export async function createProduceLot(lotData: Omit<ProduceLot, 'id' | 'status' | 'history' | 'created_at'>): Promise<ProduceLot | null> {
  const initialHistory = [{
    status: 'Registered',
    timestamp: new Date().toISOString(),
    location: lotData.origin,
    actor: 'system' // Or map farmerId to a name
  }];

  const { data, error } = await supabase
    .from('produce_batches')
    .insert([
      {
        ...lotData,
        status: 'Registered',
        history: initialHistory,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating produce lot:', error);
    return null;
  }
  
  return data;
}

// Function to update a lot's status and history
export async function updateLot(lotId: string, updates: Partial<ProduceLot>, newHistoryEvent: any): Promise<boolean> {
  // First, fetch the current history
  const lot = await getLotById(lotId);
  if (!lot) return false;

  const updatedHistory = [...(lot.history || []), newHistoryEvent];

  const { error } = await supabase
    .from('produce_batches')
    .update({ ...updates, history: updatedHistory })
    .eq('id', lotId);

  if (error) {
    console.error('Error updating lot:', error);
    return false;
  }
  return true;
}
