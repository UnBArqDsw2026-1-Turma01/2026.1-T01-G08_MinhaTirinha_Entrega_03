import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';

@Injectable()
export class ComicService {

    constructor(private readonly supabaseService: SupabaseService) {}

    async getUnreadComics(id_user: string): Promise<{id: number, name: string, image_url: string}[]> {
        const { data, error } = await this.supabaseService.getInstance().rpc('get_unread_comics', { user_id: id_user });
        if(error) {
            throw new Error(error.message);
        }
        return data;
    }

    async getUnreadComicsByCategory(id_user: string, id_category: number): Promise<{id: number, name: string, image_url: string}[]> {
        const { data, error } = await this.supabaseService.getInstance().rpc('get_unread_comics_by_category', { user_id: id_user, category_id: id_category});
        if(error) {
            throw new Error(error.message);
        }
        return data;
    }

}