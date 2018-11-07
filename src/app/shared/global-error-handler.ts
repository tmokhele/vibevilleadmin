import { Injectable, ErrorHandler, Injector } from '@angular/core';
import { AlertService } from './alert';
import { AlertComponent } from 'app/alert/alert-component';
import { MatDialog } from '@angular/material/dialog';



@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

    constructor(
        private injector: Injector, public dialog: MatDialog) {

    }

    handleError(error: any): void {
        const alertService = this.injector.get(AlertService);
        alertService.warn(error.error.message + ': for request' + error.error.path + '')
        const d = this.dialog.open(AlertComponent, {
            width: '450px',
        });

        d.afterClosed().subscribe(result => {
            alertService.clear();
        })

    }
}
