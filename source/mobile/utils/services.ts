import { ICategory } from "./entities/category.entity";
import { IComicInfo } from "./entities/comic_info.entity";
import { IGetComic } from "./entities/get_comic.entity";

export class Services {

    private static url: string = "http://192.168.1.9:3000/";
    private static timeoutMs: number = 3500;

    private static async getData(route: string): Promise<any> {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

        try {
            const response = await fetch(`${this.url}${route}`, {
                signal: controller.signal,
            });
            
            if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
            }

            const result = await response.json();
            return result;
        } catch {
            return undefined;
        } finally {
            clearTimeout(timeout);
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
    
    static async getUserComicOnHistoric(user_id: string, comic_id: number) {
        return this.getData(`comic/started/${user_id}/${comic_id}`);
    }

    static async getStartedComics(user_id: string) {
        return this.getData(`historic/in-progress/${user_id}`);
    }
}
