import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { UserService } from 'app/services/user.service';
import { AlertService } from 'app/shared/alert';
import { AlertComponent } from 'app/alert/alert-component';
import { MatDialog } from '@angular/material';
import { PasswordValidation } from 'app/shared/passwordvalidator';

@Component({
  selector: 'app-passwordreset',
  templateUrl: './passwordreset.component.html',
  styleUrls: ['./passwordreset.component.css']
})
export class PasswordResetComponent implements OnInit {
  validation_messages = {
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
    ]
  }
  userDetailsForm: FormGroup;
  constructor(private userService: UserService, public formBuilder: FormBuilder, public authService: AuthService
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
      this.alertService.success('Password Reset Succefull.')
      const d =  this.dialog.open( AlertComponent, {
            width: '650px',
        });
      d.afterClosed().subscribe(result => {
        if (result) {
          this.alertService.clear();
          // this.authService.login({
          //   username:  result.email,
          //   password: result.password
          // });
        }
      })
  }

  cancelPasswordReset() {
    this.router.navigate(['/login']);
  }

}
