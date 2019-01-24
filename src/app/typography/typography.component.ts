import { Component, OnInit, ViewChild, ElementRef, Inject, EventEmitter, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher, MatStepper, MatDialog, MatDialogRef } from '@angular/material';
import { UserService } from '../services/user.service';
import { IUserItem } from 'app/shared/model/user-item.interface';
import { AlertService } from 'app/shared/alert';
import { AlertComponent } from 'app/alert/alert-component';
import {MAT_DIALOG_DATA} from '@angular/material'


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-typography',
  templateUrl: './typography.component.html',
  styleUrls: ['./typography.component.css']
})
export class TypographyComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  matcher = new MyErrorStateMatcher();
  user: IUserItem;
  isEdit: false;
  onAdd = new EventEmitter();
  userInfo: {uid: string, name: string, surname: string, contactNumber: string,  emailAddress: string, role: string, info: boolean
    , twitter: boolean, faceBook: boolean, isEvents: boolean, password: string, profilePicURL: string, id: string}
  = {uid: '', name: '', surname: '', contactNumber: '', emailAddress: '', role: 'invalid', info: false,
   twitter: false , faceBook: false, isEvents: false, password: '', profilePicURL: '', id: '' };

  @ViewChild('search')
  public searchElementRef: ElementRef;
  constructor(public dialog: MatDialog, private _formBuilder: FormBuilder,
    private userService: UserService, public alertService: AlertService, @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
      if (data !== null) {
      this.isEdit = data.edit;
     this.userInfo.emailAddress = data.emailAddress;
     this.userInfo.password = data.password;
     this.userInfo.name = data.name;
     this.userInfo.surname = data.surname;
     this.userInfo.id = data.id;
     this.userInfo.profilePicURL = data.profilePicURL;
     this.userInfo.uid = data.uid;
     this.userInfo.contactNumber = data.contactNumber;
     this.userInfo.twitter = data.twitter;
     this.userInfo.faceBook = data.faceBook;
     this.userInfo.isEvents = data.isEvents;
     this.userInfo.role = data.role;
      }
     }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      surname: [''],
      name: [''],
      contactNumber: [''],
      emailAddress: ['', Validators.compose([Validators.required, Validators.email])]
    });
    this.secondFormGroup = this._formBuilder.group({
      role : ['invalid', Validators.required],
      info: [false],
      twitter: [false],
      faceBook: [false],
      events: [false]
    });

  }

  saveForm(stepper: MatStepper) {
    let message = ''
    this.user = this.userInfo;
    if (!this.isEdit) {
      message = 'User created successfully';
    } else {
      message = 'User updated sucessfully'
    }
    const action: string = this.isEdit ? 'editUser' : 'addUser';
    this.userService[action](this.user).subscribe(result => {
      this.onAdd.emit(result);
      this.alertService.success(message)
      const d =  this.dialog.open( AlertComponent, {
            width: '650px',
        });

      d.afterClosed().subscribe( closed => {
        if (closed) {
          stepper.reset();
          this.alertService.clear();
        }
      })

    })
  }



}
