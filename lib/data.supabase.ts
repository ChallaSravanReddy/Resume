import { supabase } from './supabase';

export async function readData<T>(filename: string): Promise<T> {
  const table = filename.replace('.json', '');
  
  if (table === 'profile') {
    const { data, error } = await supabase.from(table).select('*').limit(1).single();
    if (error) {
      console.error(`Error fetching ${table}:`, error); // Log error
      return {} as T;
    }
    return data as T;
  }

  // Handle collection tables (projects, skills, etc.)
  const { data, error } = await supabase.from(table).select('*');
  if (error) {
    console.error(`Error fetching ${table}:`, error);
    return [] as unknown as T;
  }
  
  return data as T;
}

export async function writeData<T>(filename: string, data: T): Promise<void> {
  const table = filename.replace('.json', '');
  
  if (table === 'profile') {
     // Ensure ID is passed so the existing row is updated via upsert
     const payload = data as any;
     payload.id = '00000000-0000-0000-0000-000000000000';
     const { error } = await supabase.from(table).upsert(payload);
     if (error) console.error(`Error updating profile:`, error);
     return;
  }

  const arrayData = data as any[];
  if (arrayData && Array.isArray(arrayData)) {
    // Mimic the local JSON behavior: Replace all data
    const { error: delErr } = await supabase.from(table).delete().neq('id', '0');
    if (delErr) {
      console.error(`Error clearing ${table}:`, delErr);
      return;
    }
    
    if (arrayData.length > 0) {
      const { error: insErr } = await supabase.from(table).insert(arrayData);
      if (insErr) console.error(`Error saving ${table}:`, insErr);
    }
  }
}
