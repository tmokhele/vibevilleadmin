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
      ]))
    });
  }

  onSubmitUserDetails(form: any) {
      this.alertService.success('Password Reset Succefull. You should receive an email shortly to complete the password reset')
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
  }

  cancelPasswordReset() {
    this.router.navigate(['/login']);
  }

}
