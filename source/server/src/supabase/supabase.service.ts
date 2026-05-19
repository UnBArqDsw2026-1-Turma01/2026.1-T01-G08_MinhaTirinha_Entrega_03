import { Injectable } from '@nestjs/common';

@Injectable()
export class SupabaseService {
  // Implementação manual do Singleton (GoF) que o flyan pediu
  private static instance: SupabaseService;
  private static isInstantiated: boolean = false;
  
  private supabaseClient; 

  constructor() {
    // Se a flag for falsa, seta a instância e muda para true
    if (!SupabaseService.isInstantiated) {
      
      
      SupabaseService.instance = this;
      SupabaseService.isInstantiated = true;
    }
    return SupabaseService.instance;
  }

  // Método estático que o flyan pediu
  static async get(method: string, params?: any) {
    // Como é estático, usamos a instância do Singleton para acessar o cliente
    const { data, error } = await SupabaseService.instance.supabaseClient.rpc(method, params);
    if (error) throw error;
    return data;
  }
}