import { IComic } from "./comic.entity";
import { IStatus } from "./status.entity";
import { IImage } from "./image.entity";

export interface IGetComic {
    comic_info: IComic, 
    comic_images: IImage[], 
    comic_status: IStatus
}