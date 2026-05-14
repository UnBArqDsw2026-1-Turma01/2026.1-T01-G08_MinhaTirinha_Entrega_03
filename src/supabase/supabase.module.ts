import { Global, Module } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Global() // Isso torna o Supabase disponível em todo o projeto sem precisar importar de novo
@Module({
  providers: [
    {
      provide: 'SUPABASE_CLIENT',
      useFactory: () => {
        // chaves com o flyan
        return createClient('URL_DO_SUPABASE', 'CHAVE_ANON_DO_SUPABASE');
      },
    },
  ],
  exports: ['SUPABASE_CLIENT'],
})
export class SupabaseModule {}