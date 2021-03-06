import { IReview } from './shop-item-review.interface';
import { IPerformance } from './event-performance.interface';

export interface IShopItem {
    id: string;
    name: string;
    location: string;
    category: string;
    releaseDate: Date;
    description: string;
    unitPrice: number;
    quantityInStock: number;
    rating: number;
    imageUrl: string;
    reviews?: IReview[];
    vipamount?: string;
    generalamount?: string;
    earlyamount?: string;
    performances?: IPerformance[];
    reviewsCount?: number;
    cartCount?: number;
}
