import { Component, OnInit, ViewChild, ElementRef, Inject, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher, MatStepper, MatDialog } from '@angular/material';
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
  onAdd = new EventEmitter();
  userInfo: { name: string, surname: string, contactNumber: string,  emailAddress: string, role: string, info: boolean
    , twitter: boolean, faceBook: boolean, isEvents: boolean, password: string}
  = { name: '', surname: '', contactNumber: '', emailAddress: '', role: 'invalid', info: false,
   twitter: false , faceBook: false, isEvents: false, password: ''};

  @ViewChild('search')
  public searchElementRef: ElementRef;
  constructor(public dialog: MatDialog, private _formBuilder: FormBuilder,
    private userService: UserService, public alertService: AlertService,  @Inject(MAT_DIALOG_DATA) public data: any) {
     this.userInfo.emailAddress = data.email;
     this.userInfo.password = data.password;
     this.userInfo.name = data.name;
     this.userInfo.surname = data.surname;
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
    this.user = this.userInfo;
    this.userService.addUser(this.user).subscribe(result => {
      this.onAdd.emit(result);
      this.alertService.success('User created successfully')
      const d =  this.dialog.open( AlertComponent, {
            width: '650px',
        });

      d.afterClosed().subscribe(result => {
        if (result) {
          stepper.reset();
          this.alertService.clear();
        }
      })

    })
  }



}
