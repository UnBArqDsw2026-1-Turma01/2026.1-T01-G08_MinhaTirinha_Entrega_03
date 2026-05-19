import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {

  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  }

  getInstance(): SupabaseClient 
  /**
   * Retorna o cliente supabase.
   */
  {
    return this.supabase;
  }

  // Método estático que o flyan pediu
  async get(method: string, params?: any) {
    // Como é estático, usamos a instância do Singleton para acessar o cliente
    const { data, error } = await this.supabase.rpc(method, params);
    if (error) throw error;
    return data;
  }
}
