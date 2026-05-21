import { SupabaseService } from "src/supabase/supabase.service";
import { IndexUpdateStrategy } from "./index_update_strategy";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SecondUpdateStrategy extends IndexUpdateStrategy {
    
    constructor(protected readonly supabase: SupabaseService){
        super(supabase);
    }

    async update(user_id:string, comic_id: number): Promise<number> {
        const { error } = await this.supabase.getInstance().from('Historic').update({second: true}).match({id_user: user_id, id_comic: comic_id});
        if(error) throw new Error(error.message);
        return 200;
    }

}