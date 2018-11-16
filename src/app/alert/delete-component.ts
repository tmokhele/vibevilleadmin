import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
    selector: 'app-confirm-dialog',
    templateUrl: 'confirmation-dialog.html',
})

export class ConfirmationDialogComponent {
    public confirmMessage: string;
    constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent>) { }


}
