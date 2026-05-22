import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HistoricModule } from './historic/historic.module';
import { ComicModule } from './comic/comic.module';
import { CategoryModule } from './category/category.module';
import { SupabaseModule } from './supabase/supabase.module';

//padrão estrutural: decorator
@Module({
  imports: [
    SupabaseModule, 
    ComicModule, 
    CategoryModule,
    HistoricModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],

})
export class AppModule {}