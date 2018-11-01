import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from './form-validation.service';
import { ShopItemFormValidators } from './shop-item-form.validators';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { VenueService } from '../../services/venue.service';


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
        public dialogRef: MatDialogRef<FormComponent, any>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    onNoClick(): void {
        this.dialogRef.close(null);
    }

    submitItem(form: any): void {
        if (form.valid) {
            let action: string = this.isCreateForm ? 'addShopItem' : 'updateShopItem';
            this.shop[action](form.value).subscribe(shopItem => {
                // this is to make PhantomJS not cause the error
                // undefined is not a constructor evaluating
                this.dialogRef.close(shopItem);

            });
        }
    }

    ngOnInit(): void {
        this.isCreateForm = this.data._id === undefined ? true : false
        this.shopItemForm = this.formBuilder.group({
            'name': [
                this.data ? this.data.name : '',
                Validators.compose([
                    Validators.required,
                    ShopItemFormValidators.nameValidator])
            ],
            'location': [
                this.data ? this.data.location : '',
                Validators.required
            ],
            'unitPrice': [
                this.data ? this.data.unitPrice : '',
                Validators.required
            ],
            'releaseDate': [
                this.data ? this.data.releaseDate : '',
                Validators.required
            ],
            'category': [
                this.data ? this.data.category : '',
                Validators.required
            ],
            'description': [
                this.data ? this.data.description : ''
            ]
            ,
            'imageUrl': [
                this.data ? this.data.imageUrl : ''
            ]
        });

        this.validation.configure(
            this.shopItemForm,
            {
                'name': {
                    'condition': 'invalidName',
                    'message': 'Name must start with captial letter'
                }
            },
            {}
        );
    }

    onFileChange(event) {
        let reader = new FileReader();
        if (event.target.files && event.target.files.length > 0) {
            let file = event.target.files[0];
            reader.onloadend = (e) => {
                // this.image = reader.result;
                this.data.imageUrl=reader.result;
                console.log('base 64 :'+this.data.imageUrl)
                this.shopItemForm.controls['imageUrl'].setValue(this.data.imageUrl)
                this.shopItemForm.get("imageUrl").setValue(this.data.imageUrl)
                this.files.add(file);
                const data = new Blob([file], { type: "application/text" });
                const formData = new FormData();
                formData.append("inputFile", data);
              }
            reader.readAsDataURL(file);
        };
    }
    delete(file:File)
    {
        this.files.delete(file);
        this.data.imageUrl='';
    }

}
