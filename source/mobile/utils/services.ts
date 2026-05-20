import { ICategory } from "./entities/category.entity";
import { IComicInfo } from "./entities/comic_info.entity";
import { IGetComic } from "./entities/get_comic.entity";

export class Services {

    private static url: string = "http://192.168.1.9:3000/";

    private static async getData(route: string): Promise<any> {
        try {
            const response = await fetch(`${this.url}${route}`);
            
            if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
            }

            const result = await response.json();
            return result;
        } catch (error: any) {
            console.error(error.message);
        }
    }
    static async getNotStartedComics(user_id: string): Promise<IComicInfo[]> {
        return this.getData(`comics/not-started/${user_id}`);
    }

    static async getNotStartedComicsByCategory(user_id: string, category_id: number): Promise<IComicInfo[]> {
        return this.getData(`comics/not-started/${user_id}/category/${category_id}`);
    }

    static async getCategories(): Promise<ICategory[]> {
        return this.getData('category');
    }

    static async getNotStartedComic(comic_id: number): Promise<IGetComic> {
        return this.getData(`comic/not-started/${comic_id}`);
    }

}