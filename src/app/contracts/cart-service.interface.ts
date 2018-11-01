import { Observable } from 'rxjs/Observable';
import { ICartItem } from "../shared/model/cart-item.interface";



export interface ICartService {
    getCartItems(): Observable<ICartItem[]>;
    getCartItem(userId: string, itemId: string): Observable<ICartItem>;
    addCartItem(IShopItem): Observable<ICartItem>;
    removeCartItem(ICartItem): Observable<ICartItem>;
    increaseCartItemQunatity(ICartItem): Observable<ICartItem>;
    decreaseCartItemQunatity(ICartItem): Observable<ICartItem>;
    checkOut(): void;
}
