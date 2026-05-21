import { Module } from '@nestjs/common';
import { ComicService } from './comic.service';
import { ComicController } from './comic.controller';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { FirstUpdateStrategy } from './strategy/update/first_update_strategy';
import { SecondUpdateStrategy } from './strategy/update/second_update_strategy';
import { ThirdUpdateStrategy } from './strategy/update/third_update_strategy';
import { FourthUpdateStrategy } from './strategy/update/fourth_update_strategy';

@Module({
  imports: [SupabaseModule],
  providers: [
    ComicService,
    FirstUpdateStrategy,
    SecondUpdateStrategy,
    ThirdUpdateStrategy,
    FourthUpdateStrategy
  ],
  controllers: [ComicController]
})
export class ComicModule {}
