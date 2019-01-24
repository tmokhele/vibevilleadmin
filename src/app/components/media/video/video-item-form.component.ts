import { Component, OnInit } from '@angular/core';
import { AuthData } from 'app/shared/model/auth-data.model';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ConfirmationDialogComponent } from 'app/alert/delete-component';
import { AlertService } from 'app/shared/alert';
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
    public baseVideoUrl: any = 'video:mp4;base64,'
    public videoUrl = ' '
    dialogRef: MatDialogRef<ConfirmationDialogComponent>;
    public galleryOptions: NgxGalleryOptions[] = [];
    public galleryImages: NgxGalleryImage[] = [];
    public videoUrls: string[] = [];
    constructor(
        private multifilesService: MultifilesService,
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
            documents.forEach((a, b) => {
                if (documentType === 'image') {
                    this.columnCount = this.columnCount + 1;
                    // const url = this.baseImageUrl + a;
                    const img = {
                        'big': a,
                        'small': a,
                        'medium': a
                    }
                    console.log('img ' + this.columnCount)
                    this.galleryImages.push(img);
                }
                if (documentType === 'video') {
                    // const url = this.baseVideoUrl + a;
                    this.videoUrls.push(a);
                }
            })
            if (this.videoUrls.length > 0) {
                this.videoUrl = this.videoUrls[0]
                console.log('vid url: '.concat(this.videoUrl))
            }
        })
    }


    decline() {
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
