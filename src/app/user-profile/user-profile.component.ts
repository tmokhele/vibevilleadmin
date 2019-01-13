import { Component } from '@angular/core';
import { IUserItem } from 'app/shared/model/user-item.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'app/components/auth/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {
  user: IUserItem;
  userItemForm: FormGroup;

  constructor( private formBuilder: FormBuilder, private authService: AuthService) {
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
      ]
  })
   }

}
