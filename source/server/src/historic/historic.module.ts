import { Module } from '@nestjs/common';
import { HistoricController } from './historic.controller';
import { HistoricService } from './historic.service';
import { SupabaseModule } from '../supabase/supabase.module';

/**
 * Módulo responsável por agrupar os componentes do domínio Historic (Histórico).
 * Importa o SupabaseModule para ter acesso ao banco de dados e declara
 * o Controller e o Service que trabalham juntos para fornecer os dados.
 */

@Module({
  imports: [SupabaseModule],

  controllers: [HistoricController],

  providers: [HistoricService],
})
export class HistoricModule {}