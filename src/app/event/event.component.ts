import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { VenueService } from '../services/venue.service';
import { AlertService } from 'app/shared/alert';
import { Router, ActivatedRoute } from '@angular/router';
import { EventItem } from 'app/shared/model/event-item';
import { Validators, FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { ShopItemFormValidators } from 'app/components/shop-item-form/shop-item-form.validators';
import { ValidationService } from 'app/components/shop-item-form/form-validation.service';
import { IShopItem } from 'app/shared/model/shop-item.interface';
import { AlertComponent } from 'app/alert/alert-component';


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
    constructor(public dialog: MatDialog, public venue: VenueService, public validation: ValidationService,
        public alertService: AlertService,
        public router: Router, public a: ActivatedRoute, private formBuilder: FormBuilder) {
        this.e = this.venue.getSelectedEVent();
        console.log('event value :' + JSON.stringify(this.e))
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
                (this.e.vipamount !== null && this.e.generalamount !== '')
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
                this.ticketValue.push('early');
            }
            if (this.eventItemForm.get('early').value === false) {
                this.eventItemForm.get('earlyamount').setValue('')
                this.eventItemForm.get('earlyamount').disable();
                const index = this.ticketValue.indexOf('early');
                this.ticketValue.splice(index, 10);
            }
        }
        console.log('ticket value: ' + this.ticketValue)
    }

    openDialog(shopItem?): void {
        this.router.navigate(['/event']);
    }

    previewImage(imgUrl: any) {

    }

    addImage(event: any) {

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
                    this.alertService.clear();
                    this.e = null;
                    this.eventItemForm.reset();
                    this.router.navigate(['/venue']);
                }
            })
        })
    }

    ticketValidator(control: FormControl): { [s: string]: boolean } {
        if (control.value) {
            if (this.eventItemForm.get('general').value === true
                && this.eventItemForm.get('generalamount').value === '') {
                return { invalidAmount: false };
            }
            if (this.eventItemForm.get('vip').value === true
                && this.eventItemForm.get('vipamount').value === '') {
                return { invalidAmount: false };
            }
            if (this.eventItemForm.get('early').value === true
                && this.eventItemForm.get('earlyamount').value === '') {
                return { invalidAmount: false };
            }
        }
    }

    isFieldRequired(): boolean {
        return this.ticketValue.length < 1;
    }

    isAmountRequired(): boolean {
        return ((this.eventItemForm.get('earlyamount').value === undefined || this.eventItemForm.get('earlyamount').value === '') &&
            (this.eventItemForm.get('vipamount').value === undefined || this.eventItemForm.get('vipamount').value === '') &&
            (this.eventItemForm.get('generalamount').value === undefined || this.eventItemForm.get('generalamount').value === ''));
    }
}
