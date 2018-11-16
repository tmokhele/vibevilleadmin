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
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  validation_messages = {
    'name': [
      { type: 'required', message: 'First Name is required' },
      { type: 'pattern', message: 'Your name must contain only  letters' }
    ],
    'surname': [
      { type: 'required', message: 'Surname is required' },
      { type: 'pattern', message: 'Your surname must contain only  letters' }
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
  constructor(private userService: UserService, public formBuilder: FormBuilder, public authService: AuthService
    , private router: Router, private alertService: AlertService, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.userDetailsForm = this.formBuilder.group({
      name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z \-\']+')
      ])),
      surname: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z \-\']+')
      ])),
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
    this.userService.registerUser(form).subscribe(response => {
      // tslint:disable-next-line:max-line-length
      this.alertService.success('Login details request is successful. You will receive an e-mail from the system adminstrator regarding the status of your request')
      const d = this.dialog.open(AlertComponent, {
        width: '650px',
      });
      d.afterClosed().subscribe(result => {
        if (result) {
          this.alertService.clear();
          this.router.navigate(['/login']);
        }
      })
    });
  }

  cancelRegistration() {
    this.router.navigate(['/login']);
  }

}
