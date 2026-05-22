import { ComicInfo } from 'src/comic/entities/comic_info.entity';
 
export abstract class SearchNotStartedStrategy {
  abstract search(user_id: string, category_id: number): Promise<ComicInfo[]>;
}
 