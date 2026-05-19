import { Module } from '@nestjs/common';
import { ComicService } from './comic.service';
import { ComicController } from './comic.controller';
import { SupabaseModule } from '../supabase/supabase.module';

import { ComicProgressFacade } from './comic-progress.facade';
import { UnreadStrategy } from '../comic/dtos/unread-strategy.dto';
import { ComicSearchStrategy } from '../comic/dtos/category-strategy.dto';

@Module({
  imports: [SupabaseModule],

  providers: [
    ComicService,
    ComicProgressFacade,
    UnreadStrategy,
    ComicSearchStrategy,
  ],

  controllers: [ComicController],
})

export class ComicModule {}