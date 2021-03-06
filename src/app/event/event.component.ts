import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { VenueService } from '../services/venue.service';
import { AlertService } from 'app/shared/alert';
import { Router, ActivatedRoute } from '@angular/router';
import { EventItem } from 'app/shared/model/event-item';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ShopItemFormValidators } from 'app/components/shop-item-form/shop-item-form.validators';
import { ValidationService } from 'app/components/shop-item-form/form-validation.service';
import { IShopItem } from 'app/shared/model/shop-item.interface';
import { AlertComponent } from 'app/alert/alert-component';
import { ImagePreviewComponent } from 'app/image-preview/image-preview.component';
import { PerformanceComponent } from 'app/performance/performance.component';
import { ConfirmationDialogComponent } from 'app/alert/delete-component';
import { IPerformance } from 'app/shared/model/event-performance.interface';
import { Performances } from 'app/shared/model/performance-model';


@Component({
    selector: 'app-event-list',
    templateUrl: './event.component.html',
    styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
    e: EventItem;
    public isLoaded = false;
    eventItemForm: FormGroup;
    ticketValue: string[] = [];
    events: IShopItem[] = [];
    performance: Performances;
    dialogRef: MatDialogRef<ConfirmationDialogComponent>;
    perfomranceRef: MatDialogRef<PerformanceComponent>;
    constructor(public dialog: MatDialog, public venue: VenueService, public validation: ValidationService,
        public alertService: AlertService,
        public router: Router, public a: ActivatedRoute, private formBuilder: FormBuilder) {
        this.e = this.venue.getSelectedEVent();
    }

    getImage(): any {
        if (this.e.imageUrl) {
            return this.e.imageUrl;
        } else {
            return '../assets/img/faces/noimage.png';
        }
    }
    ngOnInit(): void {
        this.eventItemForm = this.formBuilder.group({
            'name': [this.e.name, Validators.compose([Validators.required, ShopItemFormValidators.nameValidator])],
            'location': [
                this.e.location,
                Validators.required
            ],
            'releaseDate': [
                new Date(this.e.releaseDate),
                Validators.required
            ],
            'category': [
                this.e.category,
                Validators.required
            ],
            'description': [
                this.e.description
            ],
            'earlyamount': [
                { value: this.e.earlyamount, disabled: true }, Validators.pattern('^[0-9]*$')
            ],
            'vipamount': [
                { value: this.e.vipamount, disabled: true }, Validators.pattern('^[0-9]*$')
            ],
            'generalamount': [
                { value: this.e.generalamount, disabled: true }, Validators.pattern('^[0-9]*$')
            ]
            ,
            'imageUrl': [
                this.e.imageUrl
            ],
            'vip': [
                (this.e.vipamount !== null && this.e.vipamount !== '')
            ],
            'general': [
                (this.e.generalamount !== null && this.e.generalamount !== '')
            ],
            'early': [
                (this.e.earlyamount !== null && this.e.earlyamount !== '')
            ]
        });

        this.validation.configure(
            this.eventItemForm,
            {
                'name': {
                    'condition': 'invalidName',
                    'message': 'Name must start with captial letter'
                },
                'generalamount': {
                    'condition': 'invalidAmount',
                    'message': 'There should at least one ticket amount provided'
                }
            },
            {}
        );
    }

    onChange(event: any) {
        if (event === 'general') {
            if (this.eventItemForm.get('general').value === true) {
                this.eventItemForm.get('generalamount').enable();
                this.eventItemForm.get('generalamount').setValue(this.e.generalamount)
                this.ticketValue.push('general');
            }
            if (this.eventItemForm.get('general').value === false) {
                this.eventItemForm.get('generalamount').setValue('')
                this.eventItemForm.get('generalamount').disable();
                const index = this.ticketValue.indexOf('general');
                this.ticketValue.splice(index, 10);
            }
        }
        if (event === 'vip') {
            if (this.eventItemForm.get('vip').value === true) {
                this.eventItemForm.get('vipamount').enable();
                this.eventItemForm.get('vipamount').setValue(this.e.vipamount)
                this.ticketValue.push('vip');
            }
            if (this.eventItemForm.get('vip').value === false) {
                this.eventItemForm.get('vipamount').setValue('')
                this.eventItemForm.get('vipamount').disable();
                const index = this.ticketValue.indexOf('vip');
                this.ticketValue.splice(index, 10);
            }
        }
        if (event === 'early') {
            if (this.eventItemForm.get('early').value === true) {
                this.eventItemForm.get('earlyamount').enable();
                this.eventItemForm.get('earlyamount').setValue(this.e.earlyamount)
                this.ticketValue.push('early');
            }
            if (this.eventItemForm.get('early').value === false) {
                this.eventItemForm.get('earlyamount').setValue('')
                this.eventItemForm.get('earlyamount').disable();
                const index = this.ticketValue.indexOf('early');
                this.ticketValue.splice(index, 10);
            }
        }
    }

    openDialog(): void {
        this.router.navigate(['/event']);
    }

    previewImage(imgUrl: any) {
        this.dialog.open(ImagePreviewComponent, {
            data: {
                dataKey: imgUrl
            }
        });
    }

    editPerformance(p: any) {
        this.dialog.open(PerformanceComponent, {
            data: {
                performance: p,
                event: this.e
            }
        })

    }

    newPerformance() {
        this.performance = new Performances()
        this.perfomranceRef = this.dialog.open(PerformanceComponent, {
            data: {
                performance: this.performance,
                event: this.e
            }
        })
        this.perfomranceRef.afterClosed().subscribe(result => {
            if (result.name !== null && result.performanceTime !== null) {
                this.e.performances.push(result)
            }

        })

    }

    deletePerformance(performance: IPerformance) {
        this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: false
        });
        this.dialogRef.componentInstance.confirmMessage = 'Are you sure you want to remove performance from event?'
        this.dialogRef.afterClosed().subscribe(result => {
            if (result) {
                const index = this.e.performances.indexOf(performance);
                this.e.performances.splice(index, 1);
            }
            this.dialogRef = null;
        });
    }

    back() {
        this.router.navigate(['/venue']);
    }

    save() {
        this.events = [];
        this.e.vipamount = this.eventItemForm.get('vipamount').value;
        this.e.generalamount = this.eventItemForm.get('generalamount').value;
        this.e.earlyamount = this.eventItemForm.get('earlyamount').value;
        console.log('testing', JSON.stringify(this.e));
        this.events.push(this.e);
        this.venue.updateEvents(this.events).subscribe(() => {
            this.alertService.success('Event updated successfully')
            const d = this.dialog.open(AlertComponent, {
                width: '650px',
            });
            // tslint:disable-next-line:no-shadowed-variable
            d.afterClosed().subscribe(result => {
                if (result) {
                    this.venue.refreshEvents()
                    this.alertService.clear();
                    this.e = null;
                    this.eventItemForm.reset();
                    this.router.navigate(['/venue']);
                }
            })
        })
    }

    isFieldRequired(): boolean {
        return (this.eventItemForm.get('vip').value === false
            && this.eventItemForm.get('general').value === false
            && this.eventItemForm.get('early').value === false)
    }

    isAmountRequired(): boolean {
        return ((this.eventItemForm.get('earlyamount').value === null || this.eventItemForm.get('earlyamount').value === '') &&
            (this.eventItemForm.get('vipamount').value === null || this.eventItemForm.get('vipamount').value === '') &&
            (this.eventItemForm.get('generalamount').value === null || this.eventItemForm.get('generalamount').value === ''));
    }
    onFileChange(event, s: number) {
        const reader = new FileReader();
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            reader.onloadend = () => {
                if (s === 1) {
                    this.eventItemForm.controls['imageUrl'].setValue(reader.result);
                    this.eventItemForm.get('imageUrl').setValue(reader.result)
                    this.e.imageUrl = reader.result as string;
                }
                if (s === 2) {
                    this.eventItemForm.controls['imageUrl'].setValue(reader.result);
                    this.eventItemForm.get('imageUrl').setValue(reader.result)
                    this.e.imageUrl = reader.result as string;
                }
            }
            reader.readAsDataURL(file);
        };
    }
    applyFilter(filterValue: string, index: number) {
        filterValue = filterValue.trim();
        switch (index) {
            case 0:
                this.e.earlyamount = filterValue;
                break
            case 1:
                this.e.vipamount = filterValue;
                break;
            default:
                this.e.generalamount = filterValue
        }

    }
}
