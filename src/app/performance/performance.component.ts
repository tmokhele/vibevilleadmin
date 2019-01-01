import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { AlertService } from 'app/shared/alert';
import { Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { IShopItem } from 'app/shared/model/shop-item.interface';
import { IPerformance } from 'app/shared/model/event-performance.interface';
import { Observable } from 'rxjs';
import { VenueService } from 'app/services/venue.service';
import { EventItem } from 'app/shared/model/event-item';


@Component({
    selector: 'app-performance-list',
    templateUrl: './performance.component.html',
    styleUrls: ['./performance.component.css']
})
export class PerformanceComponent implements OnInit {
    e: IPerformance;
    event: EventItem;
    eventValue: string;
    public events$: Observable<IShopItem[]>;
    performanceForm: FormGroup;
    eve: IShopItem[] = [];
    @ViewChild('fileArtist') fileArtist;
    constructor(public dialog: MatDialog,
        public alertService: AlertService,  private venueService: VenueService,
        public router: Router, private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any) {
          this.e = data.performance;
          this.event = data.event;
    }

    ngOnInit(): void {
        this.events$ = this.venueService.getShopItems();
        this.events$.subscribe(ee => {
            this.eve = ee;
        })
        this.performanceForm = this.formBuilder.group({
            'event': [
                this.event.name,
                Validators.required
            ],
            'name': [
                this.e.name,
                Validators.required
            ],
            'performanceTime': [
                this.e.performanceTime,
                Validators.required
            ],
            'imageUrl': [
                ''
            ]
        })
    }

    isValid() {
        if (this.performanceForm.invalid) {
            return true;
        }
    }

    onCountrySelectionChanged(changeEvent) {
        this.eventValue =  changeEvent.source.value;
    }

    updatePerformance(performance: any) {

    }

    onFileChange(event) {
        const reader = new FileReader();
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            reader.onloadend = (e) => {

                    this.performanceForm.controls['imageUrl'].setValue(reader.result);
                    this.performanceForm.get('imageUrl').setValue(reader.result)
                    this.e.imageUrl =  this.performanceForm.controls['imageUrl'].value;
                    const data = new Blob([file], { type: 'application/text' });
                    const formData = new FormData();
                    formData.append('inputFile', data);

            }
            reader.readAsDataURL(file);
        };
    }
}
