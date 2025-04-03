
import { supabase } from '@/integrations/supabase/client';

export interface APIKeys {
  id?: string;
  user_id?: string;
  twitter_bearer_token?: string;
  fred_api_key?: string;
  india_data_api_key?: string;
  mapbox_token?: string;
  created_at?: string;
  updated_at?: string;
}

// Fetch API keys for the current user
export const fetchAPIKeys = async (): Promise<APIKeys | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('No authenticated user found');
    }
    
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('user_id', user.user.id)
      .single();
      
    if (error) {
      console.error('Error fetching API keys:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in fetchAPIKeys:', error);
    return null;
  }
};

// Update API keys for the current user
export const updateAPIKeys = async (keys: Partial<APIKeys>): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('No authenticated user found');
    }
    
    // First, check if there's an existing entry
    const { data: existingData } = await supabase
      .from('api_keys')
      .select('id')
      .eq('user_id', user.user.id)
      .maybeSingle();
    
    const updatedKeys = {
      ...keys,
      user_id: user.user.id,
      updated_at: new Date().toISOString()
    };
    
    if (existingData?.id) {
      // Update existing entry
      const { error } = await supabase
        .from('api_keys')
        .update(updatedKeys)
        .eq('id', existingData.id);
        
      if (error) {
        console.error('Error updating API keys:', error);
        return false;
      }
    } else {
      // Insert new entry
      const { error } = await supabase
        .from('api_keys')
        .insert([updatedKeys]);
        
      if (error) {
        console.error('Error inserting API keys:', error);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateAPIKeys:', error);
    return false;
  }
};
