import { SupabaseService } from "src/supabase/supabase.service";

export abstract class IndexUpdateStrategy {

    constructor(protected readonly supabase: SupabaseService){}
    abstract update(user_id:string, comic_id: number);
}