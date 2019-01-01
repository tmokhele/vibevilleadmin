import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ValidationService } from './form-validation.service';
import { ShopItemFormValidators } from './shop-item-form.validators';
import { VenueService } from '../../services/venue.service';
import { IShopItem } from 'app/shared/model/shop-item.interface';
import { AlertService } from 'app/shared/alert';
import { AlertComponent } from 'app/alert/alert-component';
import { MatDialog } from '@angular/material/dialog';
import { IPerformance } from 'app/shared/model/event-performance.interface';
import { Performances } from 'app/shared/model/performance-model';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';


@Component({
    selector: 'app-shop-item-form',
    templateUrl: './shop-item-form.component.html',
    styleUrls: ['./shop-item-form.component.css'],
    providers: [ValidationService]
})
export class FormComponent implements OnInit {
    public shopItemForm: FormGroup;
    public performanceForm: FormGroup;
    private isCreateForm = true;
    private event: IShopItem;
    @ViewChild('file') file;
    @ViewChild('fileArtist') fileArtist;
    public files: Set<File> = new Set();
    public performances: IPerformance[] = [];
    public performance: Performances = new Performances();
    public artistFiles: Set<File> = new Set();
    public events$: Observable<IShopItem[]>;
    eve: IShopItem[] = [];
    constructor(
        private shop: VenueService,
        public validation: ValidationService,
        private formBuilder: FormBuilder,
        private alertService: AlertService,
        public dialog: MatDialog,
        private router: Router
    ) {

    }
    submitItem(form: any): void {
        if (form.valid) {
            const result: IShopItem = Object.assign({}, this.shopItemForm.value);
            const action: string = this.isCreateForm ? 'addShopItem' : 'updateShopItem';
            this.shop[action](form.value).subscribe(shopItem => {
                this.alertService.success('Event added successfully')
                const d = this.dialog.open(AlertComponent, {
                    width: '650px',
                });
                d.afterClosed().subscribe(closed => {
                    if (closed) {
                        this.alertService.clear();
                        this.shopItemForm.reset();
                        this.shop.refreshEvents();
                        this.router.navigate(['/venue']);
                    }
                })
            });
        }
    }

    ngOnInit(): void {
        this.events$ = this.shop.getShopItems();
        this.events$.subscribe(ee => {
            this.eve = ee;
        })
        this.performanceForm = this.formBuilder.group({
            'event': [
                '',
                Validators.required
            ],
            'name': [
                '',
                Validators.required
            ],
            'performanceTime': [
                '',
                Validators.required
            ],
            'imageUrl': [
                ''
            ]
        })

        this.shopItemForm = this.formBuilder.group({
            'name': ['', Validators.compose([Validators.required, ShopItemFormValidators.nameValidator])],
            'location': [
                '',
                Validators.required
            ],
            'releaseDate': [
                '',
                Validators.required
            ],
            'category': [
                '',
                Validators.required
            ],
            'description': [
                ''
            ],
            'earlyamount': [
                { value: '', disabled: true },
                Validators.compose([
                    this.ticketValidator.bind(this)])
            ],
            'vipamount': [
                { value: '', disabled: true },
                Validators.compose([
                    this.ticketValidator.bind(this)])
            ],
            'generalamount': [
                { value: '', disabled: true },
                Validators.compose([
                    this.ticketValidator.bind(this)])
            ]
            ,
            'imageUrl': [
                ''
            ],
            'vip': [
                false,
                Validators.compose([this.ticketValidator.bind(this)])
            ],
            'general': [
                false,
                Validators.compose([this.ticketValidator.bind(this)])
            ],
            'early': [
                false,
                Validators.compose([this.ticketValidator.bind(this)])
            ]
        });

        this.validation.configure(
            this.shopItemForm,
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

    onCountrySelectionChanged(changeEvent) {
        this.event = changeEvent.source.value;
    }

    onChange(event) {
        if (this.shopItemForm.get('general').value === true) {
            this.shopItemForm.get('generalamount').enable();
        }
        if (this.shopItemForm.get('general').value === false) {
            this.shopItemForm.get('generalamount').setValue('')
            this.shopItemForm.get('generalamount').disable();
        }
        if (this.shopItemForm.get('vip').value === true) {
            this.shopItemForm.get('vipamount').enable();
        }
        if (this.shopItemForm.get('vip').value === false) {
            this.shopItemForm.get('vipamount').setValue('')
            this.shopItemForm.get('vipamount').disable();
        }
        if (this.shopItemForm.get('early').value === true) {
            this.shopItemForm.get('earlyamount').enable();
        }
        if (this.shopItemForm.get('early').value === false) {
            this.shopItemForm.get('earlyamount').setValue('')
            this.shopItemForm.get('earlyamount').disable();
        }
    }
    ticketValidator(control: FormControl): { [s: string]: boolean } {
        if (control.value) {
            if (this.shopItemForm.get('general').value === true
                && this.shopItemForm.get('generalamount').value === '') {
                return { invalidAmount: false };
            }
        }
    }
    onFileChange(event, s: number) {
        const reader = new FileReader();
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            reader.onloadend = (e) => {
                if (s === 1) {
                    this.shopItemForm.controls['imageUrl'].setValue(reader.result);
                    this.shopItemForm.get('imageUrl').setValue(reader.result)
                    this.files.add(file);
                    const data = new Blob([file], { type: 'application/text' });
                    const formData = new FormData();
                    formData.append('inputFile', data);
                }
                if (s === 2) {
                    this.performanceForm.controls['imageUrl'].setValue(reader.result);
                    this.performanceForm.get('imageUrl').setValue(reader.result)
                    this.artistFiles.clear();
                    this.artistFiles.add(file);
                    const data = new Blob([file], { type: 'application/text' });
                    const formData = new FormData();
                    formData.append('inputFile', data);
                }
            }
            reader.readAsDataURL(file);
        };
    }
    delete(file: File) {
        this.files.delete(file);
    }

    addMore(formData: any) {
        this.initPerformance();
        this.performanceForm.controls['name'].reset();
        this.performanceForm.controls['imageUrl'].reset();
        this.performanceForm.controls['performanceTime'].reset();
        this.artistFiles.clear();
    }

    private initPerformance() {
        this.performance = new Performances();
        this.performance.name = this.performanceForm.controls['name'].value;
        this.performance.imageUrl = this.performanceForm.controls['imageUrl'].value;
        this.performance.performanceTime = this.performanceForm.controls['performanceTime'].value;
        this.performance.lastModified = this.performanceForm.controls['event'].value.name;
        this.performances.push(this.performance);
    }

    savePerformance(formData: any) {
        if (this.performanceForm.valid) {
            this.initPerformance();
        }

        this.eve.forEach(aa => {
            this.performances.forEach(pp => {
                if (aa.name === pp.lastModified) {
                    aa.performances.push(pp);
                }
            })
        })
        this.performances = [];
        this.shop.updateEvents(this.eve).subscribe(() => {
            this.alertService.success('Performance added successfully')
            const d = this.dialog.open(AlertComponent, {
                width: '650px',
            });
            // tslint:disable-next-line:no-shadowed-variable
            d.afterClosed().subscribe(result => {
                if (result) {
                    this.alertService.clear();
                    this.event = null;
                    this.performanceForm.reset();
                    this.shop.refreshEvents();
                    this.router.navigate(['/venue']);
                }
            })
        })
    }

    removePerformance(performance: Performances) {
        const index = this.performances.indexOf(performance);
        this.performances.splice(index, 1);
    }
    isValid() {
        if (this.performanceForm.invalid && this.performances.length === 0) {
            return true;
        }
    }
}
