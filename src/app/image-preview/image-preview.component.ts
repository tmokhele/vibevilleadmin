import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { VenueService } from '../services/venue.service';
import { Observable, Subject } from 'rxjs';
import { IShopItem } from '../shared/model/shop-item.interface';
import { AlertService } from 'app/shared/alert';
import { Router } from '@angular/router';
import { EventItem } from 'app/shared/model/event-item';


@Component({
    selector: 'app-image-preview',
    templateUrl: './image-preview.component.html',
    styleUrls: ['./image-preview.component.css']
})
export class ImagePreviewComponent implements OnInit {
    public shopItems$: Observable<IShopItem[]>;
    public filterBy;
    public event: IShopItem;
    constructor(public dialog: MatDialog, public venue: VenueService, public alertService: AlertService, public router: Router) { }

    ngOnInit() {
        this.venue.clearEvent();
        this.geEventList(null);
    }

    geEventList(arg0: null): any {
        this.shopItems$ = this.venue.getShopItems();
    }

    openDialog(shopItem?): void {
        this.router.navigate(['/event']);
    }

    previewImage(imgUrl: any) {

    }

    addImage(event: any) {

    }

    editEvent(event: any) {
        this.venue.setSelectedEvent(event)
        this.router.navigate(['/editEvent']);
    }

}
