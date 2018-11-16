import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthData } from 'app/shared/model/auth-data.model';
import { UserService } from 'app/services/user.service';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { TypographyComponent } from 'app/typography/typography.component';
import { ConfirmationDialogComponent } from 'app/alert/delete-component';
import { AlertService } from 'app/shared/alert';
import { AlertComponent } from 'app/alert/alert-component';



@Component({
    selector: 'app-approve-item-form',
    templateUrl: './approve-item-form.component.html',
    styleUrls: ['./approve-item-form.component.css'],
})
export class ApproveComponent implements OnInit {
    registrationItems: AuthData[];
    dialogRef: MatDialogRef<ConfirmationDialogComponent>;
    constructor(
        private route: ActivatedRoute, public userService: UserService,
        public dialog: MatDialog, public alertService: AlertService
    ) {

    }

    ngOnInit(): void {
        this.userService.registrationSubject.subscribe(regItems => {
            this.registrationItems = regItems;
        })
    }

    approve(auth: AuthData) {
        console.log('about to approve '+JSON.stringify(auth))
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.data = auth
        const d = this.dialog.open(TypographyComponent, dialogConfig);
        const sub = d.componentInstance.onAdd.subscribe(result => {
            this.userService.deleteUser(auth).subscribe(o => {
                this.registrationItems = this.registrationItems.filter(item => item.username === auth.username);
                d.close();
            })
        });
    }

    decline(auth: any) {
        this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: false
          });
          this.dialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?'
          this.dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.userService.deleteUser(auth).subscribe(() => {
                    this.alertService.success('Record deleted successfully')
                    const d =  this.dialog.open( AlertComponent, {
                          width: '650px',
                      });
                    d.afterClosed().subscribe(closed => {
                      if (closed) {
                        this.registrationItems = this.registrationItems.filter(item => item.username === auth.email);
                        this.alertService.clear();
                      }
                    })
                })
            }
            this.dialogRef = null;
          });
    }

}
