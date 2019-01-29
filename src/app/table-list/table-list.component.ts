import { Component, OnInit, EventEmitter, Output, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { VenueService } from '../services/venue.service';
import { Observable } from 'rxjs';
import { IShopItem } from '../shared/model/shop-item.interface';
import { AlertService } from 'app/shared/alert';
import { Router } from '@angular/router';


@Component({
    selector: 'app-table-list',
    templateUrl: './table-list.component.html',
    styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit, AfterViewInit {
    displayedColumns = ['name', 'category', 'location', 'charge', 'edit', 'delete'];
    dataSource: MatTableDataSource<IShopItem>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    public shopItems: IShopItem[] = [];
    public filterBy;
    public event: IShopItem;
    constructor(public dialog: MatDialog, public venue: VenueService, public alertService: AlertService, public router: Router) {
        this.venue.clearEvent();
        this.geEventList(null);
    }

    ngOnInit() {
        this.venue.clearEvent();
        this.geEventList(null);
    }

    geEventList(arg0: null): any {
        this.venue.getShopItems().subscribe(events => {
            this.shopItems = events;
            this.dataSource = new MatTableDataSource(this.shopItems)
        });
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }
    applyFilter(filterValue: string) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSource.filter = filterValue;
    }

    openDialog(shopItem?): void {
        this.router.navigate(['/event']);
    }

    editEvent(event: any) {
        this.venue.setSelectedEvent(event)
        this.router.navigate(['/editEvent']);
    }

}
