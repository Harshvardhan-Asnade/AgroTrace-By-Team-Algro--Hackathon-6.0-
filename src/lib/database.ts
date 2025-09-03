
'use server';

import { supabase } from '@/lib/supabaseClient';
import type { ProduceLot, SupplyChainEvent, SupplyChainStatus } from './types';
import { revalidatePath } from 'next/cache';

export const getLotsByStatus = async (statuses: SupplyChainStatus[]): Promise<ProduceLot[]> => {
  const { data, error } = await supabase
    .from('produce_lots')
    .select('*');

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

  return filteredData.sort((a,b) => new Date(b.harvestDate).getTime() - new Date(a.harvestDate).getTime());
};

export const getLotsForFarmer = async (farmerId: string): Promise<ProduceLot[]> => {
    const { data, error } = await supabase
        .from('produce_lots')
        .select('*')
        .eq('farmer->>id', farmerId) // Assumes farmer is a JSONB column with an id property
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
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching lot by ID ${id}:`, error);
    return null;
  }

  return data;
};

export const createProduceLot = async (lotData: Omit<ProduceLot, 'history'> & { history: SupplyChainEvent[] }) => {
    console.log("Attempting to create produce lot with data:", lotData);
    const { data, error } = await supabase
        .from('produce_lots')
        .insert([lotData])
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
}
