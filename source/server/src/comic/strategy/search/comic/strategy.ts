import { Comic } from "src/comic/entities/comic.entity";
import { GetComic } from "src/comic/entities/get_comic.entity";
import { Image } from "src/comic/entities/image.entity";
import { Status } from "src/comic/entities/status.entity";
import { SupabaseService } from "src/supabase/supabase.service";

export abstract class GetComicStrategy {

    constructor(protected readonly supabase: SupabaseService){}

    protected async getUserComicStatusOnHistoric(user_id: string, comic_id: number): Promise<Status>
    // CREATE FUNCTION public.get_user_comic_status_on_historic(user_id uuid, comic_id integer) 
    // RETURNS TABLE(
    //   first boolean,
    //   second boolean,
    //   third boolean,
    //   fourth boolean
    // ) 
    // AS $$
    //   SELECT historic.first, historic.second, historic.third, historic.fourth
    //   FROM "Historic" AS historic
    //   WHERE (historic.id_user = user_id) AND (historic.id_comic = comic_id); 
    // $$ LANGUAGE sql;
    {
        const { data, error } = await this.supabase.getInstance().rpc('get_user_comic_status_on_historic', {user_id: user_id, comic_id: comic_id})
        if(error) throw new Error(error.message);
        return data;
    }

    protected async getUncoloredImageUrl(comic_id: number, index: number) : Promise<Image>
    // CREATE FUNCTION public.get_uncolored_image_url(comic_id integer, index integer) 
    // RETURNS TABLE(
    //   enum integer,
    //   image_url text
    // ) 
    // AS $$
    //   SELECT image.enum, image.uncolored_image_url
    //   FROM "Image" AS image
    //   WHERE (image.id_comic = comic_id) AND (image.enum = index);
    // $$ LANGUAGE sql;
    {
        const { data, error } = await this.supabase.getInstance().rpc('get_uncolored_image_url', {comic_id: comic_id, index: index})
        if(error) throw new Error(error.message);
        return data;
    }

    protected async getColoredImageUrl(comic_id: number, index: number): Promise<Image>
    // CREATE FUNCTION public.get_colored_image_url(comic_id integer, index integer) 
    // RETURNS TABLE(
    //   enum integer,
    //   image_url text
    // ) 
    // AS $$
    //   SELECT image.enum, image.colored_image_url
    //   FROM "Image" AS image
    //   WHERE (image.id_comic = comic_id) AND (image.enum = index);
    // $$ LANGUAGE sql;
    {
        const { data, error } = await this.supabase.getInstance().rpc('get_colored_image_url', {comic_id: comic_id, index: index})
        if(error) throw new Error(error.message);
        return data;
    }

    protected async getComicUncoloredImages(comic_id: number): Promise<Image[]>
    /**
     * Retorna um array de imagens não coloridas de uma comic.
     */

    // CREATE FUNCTION public.get_comic_uncolored_images(comic_id integer)
    // RETURNS TABLE(
    //   enum integer,
    //   image_url text
    // )
    // AS $$ 
    //   SELECT image.enum, image.uncolored_image_url AS image_url
    //   FROM "Image" AS image    
    //   WHERE image.id_comic = comic_id
    //   ORDER BY image.enum asc;
    // $$ LANGUAGE sql;
    {
    const { data, error } = await this.supabase.getInstance().rpc("get_comic_uncolored_images", {comic_id: comic_id});
    if(error) throw new Error(error.message);
    return data;
    }

    
    protected async getComic(comic_id: number): Promise<Comic> {
    /**
     * Retorna as informações de uma comic.
     */
    
    // CREATE FUNCTION public.get_comic(comic_id integer)
    // RETURNS TABLE(
    //    id integer,
    //    name text
    // ) 
    // AS $$
    //   SELECT comic.id, comic.name
    //   FROM "Comic" AS comic
    //   WHERE comic.id = comic_id;
    // $$ LANGUAGE sql;
    
    const { data, error } = await this.supabase.getInstance().rpc("get_comic",{comic_id: comic_id});
    if(error) throw new Error(error.message);
    return data;
    }
    
    abstract get(user_id: string, comic_id: number): Promise<GetComic>;

}