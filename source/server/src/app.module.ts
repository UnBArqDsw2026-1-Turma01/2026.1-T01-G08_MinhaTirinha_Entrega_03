import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ComicModule } from './comic/comic.module';
import { CategoryModule } from './category/category.module';
import { SupabaseModule } from './supabase/supabase.module';

@Module({
  imports: [
    SupabaseModule, 
    ComicModule, 
    CategoryModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
})
export class AppModule {}