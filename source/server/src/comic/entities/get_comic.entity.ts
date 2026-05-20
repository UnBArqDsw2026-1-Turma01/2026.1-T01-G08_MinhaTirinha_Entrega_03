import { Comic } from "./comic.entity";
import { Status } from "./status.entity";
import { Image } from "./image.entity";

export interface GetComic {
    comic_info: Comic, 
    comic_images: Image[], 
    comic_status: Status
}