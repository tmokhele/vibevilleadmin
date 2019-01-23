import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthData } from 'app/shared/model/auth-data.model';
import { UserService } from 'app/services/user.service';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { TypographyComponent } from 'app/typography/typography.component';
import { ConfirmationDialogComponent } from 'app/alert/delete-component';
import { AlertService } from 'app/shared/alert';
import { AlertComponent } from 'app/alert/alert-component';
import { MultifilesService } from 'app/services/multifiles.service';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';



@Component({
    selector: 'app-video-item-form',
    templateUrl: './video-item-form.component.html',
    styleUrls: ['./video-item-form.component.css'],
})
export class VideoComponent implements OnInit {
    registrationItems: AuthData[];
    public columnCount: number;
    public baseImageUrl: any = 'data:image/png;base64,'
    dialogRef: MatDialogRef<ConfirmationDialogComponent>;
    public galleryOptions: NgxGalleryOptions[] = [];
    public galleryImages: NgxGalleryImage[] = [];
    constructor(
        private route: ActivatedRoute, private multifilesService: MultifilesService,
        public dialog: MatDialog, public alertService: AlertService
    ) {

    }

    ngOnInit(): void {
        this.retrieveDocuments('audio')
        this.galleryOptions = [
            {
                width: '600px',
                height: '400px',
                thumbnailsColumns: this.columnCount,
                imageAnimation: NgxGalleryAnimation.Slide
            },
            // max-width 800
            {
                breakpoint: 800,
                width: '100%',
                height: '600px',
                imagePercent: 80,
                thumbnailsPercent: 20,
                thumbnailsMargin: 20,
                thumbnailMargin: 20
            },
            // max-width 400
            {
                breakpoint: 400,
                preview: false
            }
        ];

    }

    retrieveDocuments(documentType: any) {
        this.multifilesService.getFiles(documentType).subscribe(documents => {
            documents.forEach(a => {
                if (documentType === 'image') {
                    this.columnCount = this.columnCount + 1;
                    const url = this.baseImageUrl + a;
                    const img = {
                        'big': url,
                        'small': url,
                        'medium': url
                    }
                    console.log('img ' + this.columnCount)
                    this.galleryImages.push(img);
                }
            })
        })
    }


    decline(auth: any) {
        this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: false
        });
        this.dialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?'
        this.dialogRef.afterClosed().subscribe(result => {
            if (result) {
                //     this.userService.deleteUser(auth).subscribe(() => {
                //         this.alertService.success('Record deleted successfully')
                //         const d =  this.dialog.open( AlertComponent, {
                //               width: '650px',
                //           });
                //         d.afterClosed().subscribe(closed => {
                //           if (closed) {
                //             this.registrationItems = this.registrationItems.filter(item => item.username === auth.email);
                //             this.alertService.clear();
                //           }
                //         })
                //     })
                // }
            }
            this.dialogRef = null;
        });
    }

}
