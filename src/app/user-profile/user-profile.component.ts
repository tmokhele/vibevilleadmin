import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'app/components/auth/auth.service';
import { UserItem } from 'app/shared/model/user-item';
import { UserService } from 'app/services/user.service';
import { AlertComponent } from 'app/alert/alert-component';
import { MatDialog } from '@angular/material';
import { AlertService } from 'app/shared/alert';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {
    user: UserItem;
    userItemForm: FormGroup;
    @ViewChild('fileProfile') fileProfile;
    constructor(private formBuilder: FormBuilder, private authService: AuthService
        , private userService: UserService, public dialog: MatDialog, public alertService: AlertService) {
        authService.getCurrentUser().subscribe(u => {
            this.user = u;
        })
        this.userItemForm = this.formBuilder.group({
            'name': [
                this.user.name,
                Validators.required
            ],
            'surname': [
                this.user.surname
            ],
            'email': [
                this.user.emailAddress,
                Validators.required
            ],
            'contact': [
                this.user.contactNumber
            ],
            'about': [
                this.user.about
            ],
            'imageUrl': [
                this.user.profilePicURL
            ]
        })
    }

    getImage(): any {
        if (this.user.profilePicURL) {
            return this.user.profilePicURL;
        } else {
            return '../assets/img/faces/noimage.png';
        }
    }

    updateUser() {
        this.user.contactNumber = this.userItemForm.get('contact').value;
        this.user.name = this.userItemForm.get('name').value;
        this.user.surname = this.userItemForm.get('surname').value;
        this.user.emailAddress = this.userItemForm.get('email').value;
        this.userService.editUser(this.user).subscribe(e => {
            this.alertService.success('User Profile updated successfully')
            const d = this.dialog.open(AlertComponent, {
                width: '650px',
            });
        })
    }

    onFileChange(event) {
        const reader = new FileReader();
        if (event.target.files && event.target.files.length > 0) {
            console.log('1')
            const file = event.target.files[0];
            reader.onloadend = (e) => {
                    this.userItemForm.controls['imageUrl'].setValue(reader.result);
                    this.userItemForm.get('imageUrl').setValue(reader.result)
                    this.user.profilePicURL = reader.result as string;
                    const data = new Blob([file], { type: 'application/text' });
                    const formData = new FormData();
                    formData.append('inputFile', data);
            }
            reader.readAsDataURL(file);
        };
    }

}
