import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../auth.service';
import { PasswordValidation } from './passwordvalidator';
import { Router } from '@angular/router';
import { UserService } from 'app/services/user.service';
import { AlertService } from 'app/shared/alert';
import { AlertComponent } from 'app/alert/alert-component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  validation_messages = {
    'username': [
      { type: 'required', message: 'Username is required' },
      { type: 'minlength', message: 'Username must be at least 5 characters long' },
      { type: 'maxlength', message: 'Username cannot be more than 25 characters long' },
      { type: 'pattern', message: 'Your username must contain only numbers and letters' },
      { type: 'validUsername', message: 'Your username has already been taken' }
    ],
    'email': [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Enter a valid email' }
    ],
    'confirm_password': [
      { type: 'required', message: 'Confirm password is required' },
      { type: 'MutchPassword', message: 'Password mismatch' }
    ],
    'password': [
      { type: 'required', message: 'Password is required' },
      { type: 'minlength', message: 'Password must be at least 5 characters long' },
      { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number' }
    ],
    'terms': [
      { type: 'pattern', message: 'You must accept terms and conditions' }
    ]
  }
  userDetailsForm: FormGroup;
  constructor(private userService: UserService, public formBuilder: FormBuilder
    , private router: Router, private alertService: AlertService, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.userDetailsForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
     ])),
     confirm_password: ['', Validators.required]
    }, {
      validator: PasswordValidation.MatchPassword
    });
  }

  onSubmitUserDetails(form: any) {
    this.userService.addUser(form).subscribe(user => {
      this.alertService.success('Event added successfully')
      const d =  this.dialog.open( AlertComponent, {
            width: '650px',
        });
      d.afterClosed().subscribe(result => {
        if (result) {
          this.alertService.clear();
        }
      })
    })
  }

  cancelRegistration() {
    this.router.navigate(['/login']);
  }

}
