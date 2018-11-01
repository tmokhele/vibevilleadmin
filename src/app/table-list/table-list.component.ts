import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FormComponent } from '../components/shop-item-form/shop-item-form.component';
import { VenueService } from '../services/venue.service';
import { Observable } from 'rxjs';
import { IShopItem } from '../shared/model/shop-item.interface';
import { AlertComponent } from 'app/alert/alert-component';
import { AlertService } from 'app/shared/alert';


@Component({
    selector: 'app-table-list',
    templateUrl: './table-list.component.html',
    styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {

    constructor(public dialog: MatDialog, public venue: VenueService,public alertService:AlertService) { }
    public shopItems$: Observable<IShopItem[]>;
    public filterBy;
    ngOnInit() {
        this.geEventList(null);
    }

    geEventList(arg0: null): any {
        this.shopItems$ = this.venue.getShopItems();
    }

    openDialog(shopItem?): void {
        let dialogRef = this.dialog.open(FormComponent, {
            width: '650px',
            data: {
                _id: shopItem ? shopItem._id : undefined,
                name: shopItem ? shopItem.name : undefined,
                location: shopItem ? shopItem.location : undefined,
                category: shopItem ? shopItem.category : undefined,
                unitPrice: shopItem ? shopItem.unitPrice : undefined,
                quantityInStock: shopItem ? shopItem.quantityInStock : undefined,
                releaseDate: shopItem ? shopItem.releaseDate : undefined,
                description: shopItem ? shopItem.description : undefined,
                imageUrl: shopItem ? shopItem.imageUrl : undefined,
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.shopItems$ = this.venue.getShopItems();
            }
        });
    }

    previewImage(imgUrl: any) {
        this.alertService.error("Testing")
      let d =  this.dialog.open(AlertComponent,{
            width: '650px',
        });

      d.afterClosed().subscribe(result =>{
          this.alertService.clear();
      })

    }

    addImage(event: any) {

    }

}