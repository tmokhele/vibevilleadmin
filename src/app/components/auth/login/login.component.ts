import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import { AuthData } from '../../../shared/model/auth-data.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  constructor( private authService: AuthService) {
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl('', {
        validators: [Validators.required]
      }),
      password: new FormControl('', {validators: [Validators.required]})
    });
  }


  onSubmit(form: NgForm) {
    // this.showLoadingDialog();
    setTimeout(() => {
      this.login({
        username:  form.form.value.email,
        password: form.form.value.password
      });
    }, 4000);

    console.log(form);
  }

  login(authData: AuthData) {
    this.authService.login(authData);
  }

}
