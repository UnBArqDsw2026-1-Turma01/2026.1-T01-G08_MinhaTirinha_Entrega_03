import { Controller, Get, Param } from '@nestjs/common';
import { ComicService } from './comic.service';

@Controller('comics') // PADRÃO: Facade
export class ComicController {
  constructor(private readonly comicService: ComicService) {}

  @Get('not-started/:userId')
  getNotStarted(@Param('userId') userId: string) {
    return this.comicService.findByStrategy(userId, 'unread');
  }

  @Get('not-started/:userId/category/:categoryId')
  getByCategory(@Param('userId') userId: string, @Param('categoryId') categoryId: string) {
    return this.comicService.findByStrategy(userId, 'category', categoryId);
  }
}