import { IPerformance } from './event-performance.interface';
import { IReview } from './shop-item-review.interface';

export class Performances implements IPerformance {
    id: string;
    name: string;
    imageUrl?: string;
    performanceTime?: string;
    quantity: number;
    unitPrice?: number;
    lastModified?: string;
    reviews?: IReview[];

}
