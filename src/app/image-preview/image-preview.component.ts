import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material'


@Component({
    selector: 'app-image-preview',
    templateUrl: './image-preview.component.html',
    styleUrls: ['./image-preview.component.css']
})
export class ImagePreviewComponent {
    public imageUrl: string;
    constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
        this.imageUrl = data.dataKey;
    }

}
