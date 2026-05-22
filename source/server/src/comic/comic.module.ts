import { Module } from '@nestjs/common';
import { ComicService } from './comic.service';
import { ComicController } from './comic.controller';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { FirstUpdateStrategy } from './strategy/update/concrete-strategy-1';
import { SecondUpdateStrategy } from './strategy/update/concrete-strategy-2';
import { ThirdUpdateStrategy } from './strategy/update/concrete-strategy-3';
import { FourthUpdateStrategy } from './strategy/update/concrete-strategy-4';
import { SearchNotStartedComicStrategy } from './strategy/search/comic-infos/concrete-stratey-1';
import { SearchNotStartedComicByCategoryStrategy } from './strategy/search/comic-infos/concrete-strategy-2';
import { GetStartedComicStrategy } from './strategy/search/comic/concrete-strategy-1';
import { GetNotStartedComicStrategy } from './strategy/search/comic/concrete-strategy-2';

@Module({
  imports: [SupabaseModule],
  providers: [
    ComicService,
    GetStartedComicStrategy,
    GetNotStartedComicStrategy,
    SearchNotStartedComicStrategy,
    SearchNotStartedComicByCategoryStrategy,
    FirstUpdateStrategy,
    SecondUpdateStrategy,
    ThirdUpdateStrategy,
    FourthUpdateStrategy
  ],
  controllers: [ComicController]
})
export class ComicModule {}
