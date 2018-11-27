import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Output, EventEmitter } from '@angular/core';

import * as moment from 'moment/moment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';


import { IShopService } from '../contracts/shop-service.interface';
import { IShopItem } from '../shared/model/shop-item.interface';
import { IReview } from '../shared/model/shop-item-review.interface';
import { ICartItem } from '../shared/model/cart-item.interface';
import { AuthService } from '../components/auth/auth.service';
import { CustomError } from '../error/custom-error';
import { fromPromise } from 'rxjs/internal/observable/fromPromise';


// const _array = require('lodash/array');

@Injectable()
export class VenueService implements IShopService {
    private subject = new BehaviorSubject<IShopItem[]>([])
    public shopItems$: Observable<IShopItem[]> = this.subject.asObservable()
    @Output() events = new EventEmitter<IShopItem[]>();
    constructor(
        private http: HttpClient,
        private auth: AuthService
    ) {

    }

    getShopItems(userId?: string): Observable<IShopItem[]> {
        if (sessionStorage.getItem('events') === null) {

            let url = 'event';

            if (userId) {
                url = url + '/' + userId;
            }
            const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
            const network$ = this.http
                .get<IShopItem[]>(url, { headers: headers })
                .publishReplay(1, 5000)
                .refCount();

            network$.subscribe(
                shopItems => {
                    sessionStorage.setItem('events', JSON.stringify(shopItems));
                    this.subject.next(shopItems);
                },
                (err) => {
                    throw new CustomError(err, 'Something went wrong :(')
                },
            );
            return network$;
        } else {
            const a = JSON.parse(sessionStorage.getItem('events'));
            return new Observable((observer) => {
                // observable execution
                observer.next(a)
                observer.complete()
            })
        }
    }

    getShopItem(id: string): Observable<IShopItem> {
        return this.http.get<IShopItem>('event/' + id + '/detail')
    }

    addShopItem(body: any): Observable<IShopItem> {
        return this.http.post<IShopItem>('event', body)
    }

    updateShopItem(body: any): Observable<IShopItem> {
        return this.http.put<IShopItem>('event', body)
    }

    setShopItemReview(itemId: string, remarks: string, rating: number): Observable<IReview> {
        const body: any = {
            'itemId': itemId,
            'userId': this.auth.authenticatedUserId,
            'reviewDate': moment().format('LLL'),
            'remarks': remarks,
            'rating': rating
        };

        return this.http.post<IReview>('review', body)
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
