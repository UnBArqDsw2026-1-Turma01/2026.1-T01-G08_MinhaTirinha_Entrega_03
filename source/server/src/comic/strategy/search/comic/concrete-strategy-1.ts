import { GetComic } from "src/comic/entities/get_comic.entity";
import { GetComicStrategy } from "./strategy";
import { Injectable } from "@nestjs/common";
import { SupabaseService } from "src/supabase/supabase.service";
import { Image } from "src/comic/entities/image.entity";

@Injectable()
export class GetStartedComicStrategy extends GetComicStrategy {
    constructor(protected readonly supabase: SupabaseService) {
        super(supabase);
    }

      async get(user_id: string, comic_id: number, ): Promise<GetComic> {
        const comic_info = await this.getComic(comic_id);
        let comic_status = await this.getUserComicStatusOnHistoric(user_id, comic_id);
        comic_status = comic_status[0];
    
        
        let firstImage: Image, secondImage: Image, thirdImage: Image, fourthImage: Image;
    
        if(comic_status.first) firstImage = await this.getColoredImageUrl(comic_id, 1);
        else firstImage = await this.getUncoloredImageUrl(comic_id, 1);
        
        if(comic_status.second) secondImage = await this.getColoredImageUrl(comic_id, 2);
        else secondImage = await this.getUncoloredImageUrl(comic_id, 2);
        
        if(comic_status.third) thirdImage = await this.getColoredImageUrl(comic_id, 3);
        else thirdImage = await this.getUncoloredImageUrl(comic_id, 3);
        
        if(comic_status.fourth) fourthImage = await this.getColoredImageUrl(comic_id, 4);
        else fourthImage = await this.getUncoloredImageUrl(comic_id, 4);
    
        const comic_images: Image[] = [firstImage[0], secondImage[0], thirdImage[0], fourthImage[0]];
    
        return {comic_info, comic_images, comic_status};
      }
    
}