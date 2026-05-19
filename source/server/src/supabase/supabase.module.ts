import { Module, Global } from '@nestjs/common';
import { SupabaseService } from './supabase.service';

@Global() // Se for global para o projeto todo
@Module({
  providers: [SupabaseService], // Só o provider aqui, limpo! 
  exports: [SupabaseService],   // Exporta para os outros usarem 
export class SupabaseModule {}