import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'app/services/user.service';
import { MatDialog, MatDialogConfig, MatDialogRef, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { TypographyComponent } from 'app/typography/typography.component';
import { ConfirmationDialogComponent } from 'app/alert/delete-component';
import { AlertService } from 'app/shared/alert';
import { AlertComponent } from 'app/alert/alert-component';
import { IUserItem } from 'app/shared/model/user-item.interface';



@Component({
    selector: 'app-user-edit-form',
    templateUrl: './user-edit-form.component.html',
    styleUrls: ['./user-edit-form.component.css'],
})
export class UserEditComponent implements AfterViewInit {
    displayedColumns = ['name', 'surname', 'email', 'phone', 'edit' , 'delete'];
    dataSource: MatTableDataSource<IUserItem>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    userItems: IUserItem[];
    dialogRef: MatDialogRef<ConfirmationDialogComponent>;
    constructor(
        private route: ActivatedRoute, public userService: UserService,
        public dialog: MatDialog, public alertService: AlertService
    ) {
        this.userService.getUsers().subscribe(regItems => {
            this.userItems = regItems;
            this.dataSource = new MatTableDataSource(this.userItems)
        })
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.dataSource.filter = filterValue;
      }
    approve(auth: any) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        auth.edit = true;
        dialogConfig.data = auth
        const d = this.dialog.open(TypographyComponent, dialogConfig);
        const sub = d.componentInstance.onAdd.subscribe(result => {
            this.userService.deleteUser(auth).subscribe(o => {
                // this.registrationItems = this.registrationItems.filter(item => item.username === auth.email);
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
                this.userService.deleteUserInfo(auth).subscribe(() => {
                    this.alertService.success('Record deleted successfully')
                    const d =  this.dialog.open( AlertComponent, {
                          width: '650px',
                      });
                    d.afterClosed().subscribe(closed => {
                      if (closed) {
                          const index = this.userItems.indexOf(auth);
                        this.userItems.splice(index, 1);
                        this.dataSource = new MatTableDataSource(this.userItems)
                        this.alertService.clear();
                      }
                    })
                })
            }
            this.dialogRef = null;
          });
    }

}
