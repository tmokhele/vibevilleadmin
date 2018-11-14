import { Component,  OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthData } from 'app/shared/model/auth-data.model';
import { UserService } from 'app/services/user.service';



@Component({
    selector: 'app-approve-item-form',
    templateUrl: './approve-item-form.component.html',
    styleUrls: ['./approve-item-form.component.css'],
})
export class ApproveComponent implements OnInit {
    registrationItems: AuthData[];
    constructor(
        private route: ActivatedRoute, public userService: UserService
    ) {

    }

    ngOnInit(): void {
        this.userService.registrationItems$.subscribe(regItems => {
           this.registrationItems = regItems;
        })
    }

    approve(auth: AuthData) {
    }

    decline(auth: AuthData) {
    }

}
