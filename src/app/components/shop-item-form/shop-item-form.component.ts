import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ValidationService } from './form-validation.service';
import { ShopItemFormValidators } from './shop-item-form.validators';
import { VenueService } from '../../services/venue.service';
import { IShopItem } from 'app/shared/model/shop-item.interface';
import { AlertService } from 'app/shared/alert';
import { AlertComponent } from 'app/alert/alert-component';
import { MatDialog } from '@angular/material/dialog';


@Component({
    selector: 'app-shop-item-form',
    templateUrl: './shop-item-form.component.html',
    styleUrls: ['./shop-item-form.component.css'],
    providers: [ValidationService]
})
export class FormComponent implements OnInit {
    public shopItemForm: FormGroup;
    private isCreateForm = true;
    @ViewChild('file') file;
    public files: Set<File> = new Set();

    constructor(
        private shop: VenueService,
        public validation: ValidationService,
        private formBuilder: FormBuilder,
        private alertService: AlertService,
        public dialog: MatDialog
    ) {

    }

    onNoClick(): void {

    }

    submitItem(form: any): void {
        if (form.valid) {
            const result:  IShopItem =  Object.assign({}, this.shopItemForm.value);
            const action: string = this.isCreateForm ? 'addShopItem' : 'updateShopItem';
            this.shop[action](form.value).subscribe(shopItem => {
                this.alertService.success('Event added successfully')
                const d =  this.dialog.open( AlertComponent, {
                      width: '650px',
                  });
                // tslint:disable-next-line:no-shadowed-variable
                d.afterClosed().subscribe( result => {
                  if (result) {
                    this.alertService.clear();
                    this.shopItemForm.reset();
                  }
                })
            });
        }
    }

    ngOnInit(): void {
        // this.isCreateForm = this.data._id === undefined ? true : false
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
    onFileChange(event) {
        const reader = new FileReader();
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            reader.onloadend = (e) => {
                // this.image = reader.result;
                // this.data.imageUrl = reader.result;
                this.shopItemForm.controls['imageUrl'].setValue(reader.result);
                this.shopItemForm.get('imageUrl').setValue(reader.result)
                this.files.add(file);
                const data = new Blob([file], { type: 'application/text' });
                const formData = new FormData();
                formData.append('inputFile', data);
            }
            reader.readAsDataURL(file);
        };
    }
    delete(file: File) {
        this.files.delete(file);
        // this.data.imageUrl = '';
    }

}
