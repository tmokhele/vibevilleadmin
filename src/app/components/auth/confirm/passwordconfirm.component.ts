import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from 'app/shared/alert';
import { AlertComponent } from 'app/alert/alert-component';
import { MatDialog } from '@angular/material';
import { PasswordValidation } from 'app/shared/passwordvalidator';
import { PasswordReset } from 'app/shared/model/passwordreset-model';

@Component({
  selector: 'app-passwordconfirm',
  templateUrl: './passwordconfirm.component.html',
  styleUrls: ['./passwordconfirm.component.css']
})
export class PasswordConfirmComponent implements OnInit {
  passwordResetRequest: PasswordReset = new PasswordReset();
  validation_messages = {
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
  constructor(public formBuilder: FormBuilder, public authService: AuthService
    , private router: Router, private alertService: AlertService
    , public dialog: MatDialog, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.queryParams
    .subscribe(params => {
      this.passwordResetRequest.apiKey = params.apiKey;
      this.passwordResetRequest.oobCode = params.oobCode;
    });
    this.userDetailsForm = this.formBuilder.group({
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
      this.passwordResetRequest.newPassword = form.password;
      this.authService.confirmPasswordReset(this.passwordResetRequest)
      .subscribe( passwordConfirmed => {
        this.alertService.success('Password Reset Completed. Please use updated password to login')
        const d =  this.dialog.open( AlertComponent, {
              width: '650px',
          });
        d.afterClosed().subscribe(result => {
          if (result) {
            this.alertService.clear();
            this.userDetailsForm.reset();
            this.router.navigate(['/login']);
          }
        })
      })
  }

  cancelPasswordReset() {
    this.router.navigate(['/login']);
  }

}
