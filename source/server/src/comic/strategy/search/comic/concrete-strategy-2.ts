import { GetComic } from "src/comic/entities/get_comic.entity";
import { GetComicStrategy } from "./strategy";
import { Injectable } from "@nestjs/common";
import { SupabaseService } from "src/supabase/supabase.service";
import { Status } from "src/comic/entities/status.entity";

@Injectable()
export class GetNotStartedComicStrategy extends GetComicStrategy {
    constructor(protected readonly supabase: SupabaseService) {
        super(supabase);
    }
    
    async get(user_id: string, comic_id: number): Promise<GetComic> {
        const comic_info = await this.getComic(comic_id);
        const  comic_images = await this.getComicUncoloredImages(comic_id);
        const comic_status: Status = {first: false, second: false, third: false, fourth: false};
        return {comic_info, comic_images, comic_status};
    }
}