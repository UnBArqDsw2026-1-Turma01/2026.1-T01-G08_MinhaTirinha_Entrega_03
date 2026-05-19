import { Controller, Get, Param, Patch } from '@nestjs/common';
import { ComicService } from './comic.service';
import { ComicProgressFacade } from './comic-progress.facade';

@Controller('comics') // PADRÃO: Facade
export class ComicController {
  constructor(private readonly comicService: ComicService,
              private readonly comicProgressFacade: ComicProgressFacade,
  ) {}

  @Get('not-started/:userId')
  getNotStarted(@Param('userId') userId: string) {
    return this.comicService.findByStrategy('unread', {userId});
  }

  @Get('not-started/:userId/category/:categoryId')
  getByCategory(@Param('userId') userId: string, @Param('categoryId') categoryId: string) {
    return this.comicService.findByStrategy('category',{userId, category: categoryId,});
  }

  //get das cores
  @Get(':comicId/images')
  getComicImages(
    @Param('comicId') comicId: string
  ) {

    return this.comicService.getComicImages(
      +comicId
    );
  }

  //controller de liberar o quadrinho
  @Patch(':comicId/progress/:field/:userId') //atualizar parcialmente
  updateProgress(
    @Param('comicId') comicId: string,

    @Param('field')
    field: 'first' | 'second' | 'third' | 'fourth',

    @Param('userId') userId: string,
  ) {

    //chama a comic-progresse.facade
    return this.comicProgressFacade.updateProgress(
      userId,
      +comicId,
      field,
    );
  }
}