import { Module } from '@nestjs/common';
import { ComicModule } from './comic/comic.module';
import { CategoryModule } from './category/category.module';
import { SupabaseModule } from './supabase/supabase.module';

@Module({
  imports: [
    SupabaseModule, 
    ComicModule, 
    CategoryModule
  ],
})
export class AppModule {}