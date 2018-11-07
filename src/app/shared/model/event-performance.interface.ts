import { IReview } from './shop-item-review.interface';

export interface IPerformance {
    id: string;
    name: string;
    imageUrl?: string;
    performanceTime?: string;
    quantity: number;
    unitPrice?: number;
    lastModified?: string;
    reviews?: IReview[];
}
