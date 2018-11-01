import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as moment from 'moment/moment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';


import { IShopService } from '../contracts/shop-service.interface';
import { IShopItem } from "../shared/model/shop-item.interface";
import { IShopItemReview } from "../shared/model/shop-item-review.interface";
import { ICartItem } from "../shared/model/cart-item.interface";
import { AuthService } from '../components/auth/auth.service';
import { CustomError } from '../error/custom-error';


// const _array = require('lodash/array');

@Injectable()
export class VenueService implements IShopService {
    private subject = new BehaviorSubject<IShopItem[]>([])
    public shopItems$: Observable<IShopItem[]> = this.subject.asObservable()

    constructor(
        private http: HttpClient,
        private auth: AuthService
    ) {
        
    }

    getShopItems(userId?: string): Observable<IShopItem[]> {
        let url = 'event';

        if (userId) {
            url = url + '/' + userId;
        }
           let headers = new HttpHeaders({'Content-Type': 'application/json', 'Accept': 'application/json'});
        const network$ = this.http
            .get<IShopItem[]>(url,{headers: headers})
            .publishReplay(1, 5000)
            .refCount();

        network$.subscribe(
            shopItems => {
                this.subject.next(shopItems);
            },
            (err) => {
                throw new CustomError(err, 'Something went wrong :(')
            },
        );

        return network$;
    }

    getShopItem(id: string): Observable<IShopItem> {
        return this.http.get<IShopItem>('event/' + id + '/detail')
    }

    addShopItem(body: any): Observable<IShopItem> {
        console.log('adding event: '+JSON.stringify(body))
        return this.http.post<IShopItem>('event', body)
    }

    updateShopItem(body: any): Observable<IShopItem> {
        return this.http.put<IShopItem>('event', body)
    }

    setShopItemReview(itemId: string, remarks: string, rating: number): Observable<IShopItemReview> {
        let body: any = {
            'itemId': itemId,
            'userId': this.auth.authenticatedUserId,
            'reviewDate': moment().format('LLL'),
            'remarks': remarks,
            'rating': rating
        };

        return this.http.post<IShopItemReview>('review', body)
    }

    refreshCartCountFor(cartItem: ICartItem) {
        this.subject.value
            .filter(shopItem => shopItem._id === cartItem.itemId)
            .shift()
            .cartCount = cartItem.quantity

        this.subject.next(this.subject.value);
    }

    refreshShopItem(shopItem: IShopItem) {
        // const shopItems = this.subject.value
        // const index = _array.findIndex(shopItems, {_id: shopItem._id});

        // if (index !== -1) {
        //     shopItem.reviewsCount = shopItems[index].reviewsCount
        //     shopItem.cartCount = shopItems[index].cartCount
        //     this.subject.value.splice(index, 1, shopItem);
        // } else {
        //     this.subject.value.push(shopItem);
        // }
    }
}
