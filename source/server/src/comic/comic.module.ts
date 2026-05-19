import { Module } from '@nestjs/common';
import { ComicService } from './comic.service';
import { ComicController } from './comic.controller';

@Module({
  providers: [ComicService],
  controllers: [ComicController]
})
export class ComicModule {}
