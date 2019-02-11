import { Component, OnInit } from '@angular/core';
import { AuthData } from 'app/shared/model/auth-data.model';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ConfirmationDialogComponent } from 'app/alert/delete-component';
import { AlertService } from 'app/shared/alert';
import { MultifilesService } from 'app/services/multifiles.service';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { VgAPI } from 'videogular2/core';
import { AlertComponent } from 'app/alert/alert-component';
import { IMedia } from 'app/shared/model/media-model';


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
    public videoUrl = ''
    public documentType = ''
    api: VgAPI;
    currentIndex = 0;
    dialogRef: MatDialogRef<ConfirmationDialogComponent>;
    public galleryOptions: NgxGalleryOptions[] = [];
    public galleryImages: NgxGalleryImage[] = [];
    public videoUrls: string[] = [];
    public vids: IMedia[] = new Array<IMedia>();
    public playlist: IMedia[] = new Array<IMedia>();
    public currentItem: IMedia = this.vids[this.currentIndex]
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
        this.documentType = documentType
        this.galleryImages = []
        this.vids = []
        this.playlist = []
        this.multifilesService.getFiles(documentType).subscribe(documents => {
            Object.keys(documents).forEach(key => {
                if (documentType === 'image') {
                    this.columnCount = this.columnCount + 1;
                    const img = {
                        'big': documents[key],
                        'small': documents[key],
                        'medium': documents[key]
                    }
                    this.galleryImages.push(img);
                }
                if (documentType === 'video') {
                    const media = this.getMedia(key, documents);
                    this.vids.push(media);
                    this.currentItem = this.vids[this.currentIndex]
                } else {
                    const media = this.getMedia(key, documents);
                    this.playlist.push(media);
                    this.currentItem = this.playlist[this.currentIndex]
                }
            })
        })
    }

    private getMedia(key: string, documents: Map<string, string>) {
        const a = key.substring(key.indexOf('/') + 1);
        console.log('key: '.concat(key))
        const media = new IMedia();
        media.source = documents[key];
        media.label = a;
        media.type = key.slice(-3);
        return media;
    }

    onClickPLaylistItem(item: IMedia, index: number) {
        this.currentIndex = index;
        this.currentItem = item;
    }

    onClickDeleteItem(item: IMedia,  index: number) {
        this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: false
          });
          this.dialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?'
          this.dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.multifilesService.deleteMedia(item).subscribe(() => {
                    this.alertService.success(this.documentType.concat(' record deleted successfully'))
                    const d =  this.dialog.open( AlertComponent, {
                          width: '650px',
                      });
                    d.afterClosed().subscribe(closed => {
                      if (closed) {
                          switch (this.documentType) {
                              case 'video':
                              this.vids.splice(index, 1);
                              break;
                              case 'audio':
                              this.playlist.splice(index, 1);
                              break

                            default:
                            this.galleryImages.splice(index, 1);
                            break;
                          }
                        this.alertService.clear();
                      }
                    })
                })
            }
            this.dialogRef = null;
          });
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
    onPlayerReady(api: VgAPI) {
        this.api = api;
        this.api.getDefaultMedia().currentTime = 0;
        this.api.getDefaultMedia().subscriptions.loadedMetadata.subscribe(this.playVideo.bind(this));
        this.api.getDefaultMedia().subscriptions.ended.subscribe(this.nextVideo.bind(this));
    }

    onMusicPlayerReady(api: VgAPI) {
        this.api = api;
        this.api.getDefaultMedia().subscriptions.ended.subscribe(() => {
            // Set the audio to the beginning
            this.api.getDefaultMedia().currentTime = 0;
        });
    }

    nextVideo() {
        this.currentIndex++;

        if (this.currentIndex === this.vids.length) {
            this.currentIndex = 0;
        }

        this.currentItem = this.vids[this.currentIndex];
    }

    playVideo() {
        this.api.play();
    }

}
