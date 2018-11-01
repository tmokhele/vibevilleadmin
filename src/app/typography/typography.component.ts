import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher, MatStepper } from '@angular/material';
import { UserService } from '../services/user.service';
import { IUserItem } from 'app/shared/model/user-item.interface';


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
  user:IUserItem;

  @ViewChild("search")
  public searchElementRef: ElementRef;
  constructor(private _formBuilder: FormBuilder,private userService:UserService) { }
  userInfo: { name: string, surname: string, contactNumber: string,  emailAddress: string, role: string, info: boolean, twitter: boolean,faceBook:boolean,isEvents:boolean}
  = { name: '', surname: '', contactNumber: '', emailAddress: '', role: 'invalid', info: false, twitter: false ,faceBook:false,isEvents:false};
  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      surname: ['', Validators.required],
      name: ['', Validators.required],
      contactNumber: ['', Validators.required],
      emailAddress: ['', Validators.compose([Validators.required, Validators.email])]
    });
    this.secondFormGroup = this._formBuilder.group({
      role : ['invalid', Validators.required],
      info:[false],
      twitter:[false],
      faceBook:[false],
      events:[false]
    });

  }

  saveForm(stepper: MatStepper) {
    this.user = this.userInfo;
    this.userService.addUser(this.user).subscribe(result =>{
      stepper.reset();
    })
  }



}
