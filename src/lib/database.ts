

'use server';

import { supabase } from '@/lib/supabaseClient';
import type { ProduceLot, SupplyChainEvent, SupplyChainStatus, Feedback } from './types';
import { revalidatePath } from 'next/cache';

const LOT_COLUMNS = 'id, name, origin, plantingDate, harvestDate, itemCount, farmer, certificates, history';

/**
 * Forces the Supabase PostgREST API to reload its schema cache.
 * This is a workaround for the issue where the API doesn't immediately
 * recognize new tables or columns added via the SQL editor.
 */
export const refreshSchemaCache = async () => {
    try {
        const { error } = await supabase.rpc('pgrst_watch');
        if (error) {
            console.error('Error refreshing schema cache:', error);
        } else {
            console.log('Successfully triggered schema cache refresh.');
        }
    } catch (e) {
        console.error('Failed to call pgrst_watch RPC:', e);
    }
}

export const getLotsByStatus = async (statuses: SupplyChainStatus[]): Promise<ProduceLot[]> => {
  const { data, error } = await supabase
    .from('produce_lots')
    .select(LOT_COLUMNS)
    .order('harvestDate', { ascending: false });

  if (error) {
    console.error('Error fetching produce lots:', error);
    return [];
  }
  
  // This filtering is not ideal and should be done in the query if possible
  // For example, by having a dedicated `status` column on the table.
  const filteredData = data.filter(lot => {
    const lastEvent = lot.history[lot.history.length - 1];
    return lastEvent && statuses.includes(lastEvent.status);
  });

  return filteredData;
};

export const getLotsForFarmer = async (farmerId: string): Promise<ProduceLot[]> => {
    const { data, error } = await supabase
        .from('produce_lots')
        .select(LOT_COLUMNS)
        .eq('farmer->>id', farmerId) 
        .order('harvestDate', { ascending: false });

    if (error) {
        console.error('Error fetching farmer lots:', error);
        return [];
    }
    return data;
};


export const getLotById = async (id: string): Promise<ProduceLot | null> => {
  const { data, error } = await supabase
    .from('produce_lots')
    .select(LOT_COLUMNS)
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching lot by ID ${id}:`, error);
    return null;
  }

  return data;
};

export const createProduceLot = async (lotData: Omit<ProduceLot, 'certificates'>) => {
    console.log("Attempting to create produce lot with data:", lotData);
    const { data, error } = await supabase
        .from('produce_lots')
        .insert([{ ...lotData, certificates: [] }])
        .select()
        .single();

    if (error) {
        console.error('Error creating produce lot in database.ts:', error);
        // Throw the specific error message from Supabase
        throw new Error(error.message);
    }

    console.log("Successfully created lot:", data);
    revalidatePath('/dashboard');
    return data;
};

export const updateLotHistory = async (lotId: string, newEvent: SupplyChainEvent): Promise<ProduceLot | null> => {
    const lot = await getLotById(lotId);
    if (!lot) {
        throw new Error('Lot not found');
    }

    const newHistory = [...lot.history, newEvent];

    const { data, error } = await supabase
        .from('produce_lots')
        .update({ history: newHistory })
        .eq('id', lotId)
        .select()
        .single();

    if (error) {
        console.error('Error updating lot history:', error);
        throw new Error('Failed to update lot.');
    }

    revalidatePath('/dashboard');
    revalidatePath(`/trace/${lotId}`);
    return data;
};

export const createFeedback = async (feedbackData: Omit<Feedback, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('feedback')
    .insert([feedbackData])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating feedback:', error);
    throw new Error(error.message);
  }

  return data;
};
