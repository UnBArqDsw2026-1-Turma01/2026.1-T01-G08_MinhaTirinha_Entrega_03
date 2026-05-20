import { SupabaseClient } from '@supabase/supabase-js';

export abstract class HistoricStrategy {
  protected supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  abstract execute(userId: string, comicId?: number): Promise<any>;
}
