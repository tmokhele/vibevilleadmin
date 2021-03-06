import { Component, OnInit, Inject } from '@angular/core';

import { AlertService } from 'app/shared/alert';
import { Alert, AlertType } from '../shared/model/alert-model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';



@Component({
    // tslint:disable-next-line:component-selector
    selector: 'alert',
    templateUrl: './alert.component.html'
})
export class AlertComponent {
    alerts: Alert[] = [];
    constructor(private alertService: AlertService) { }

    // tslint:disable-next-line:use-life-cycle-interface
    ngOnInit() {

        this.alertService.subject.subscribe((alert: Alert) => {
            if (!alert) {
                this.alerts = [];
                return;
            }
            this.alerts.push(alert);
        });
    }

    removeAlert(alert: Alert) {
        this.alerts = this.alerts.filter(x => x !== alert);
    }

    cssClass(alert: Alert) {
        if (!alert) {
            return;
        }

        switch (alert.type) {
            case AlertType.Success:
                return 'alert alert-success';
            case AlertType.Error:
                return 'alert alert-danger';
            case AlertType.Info:
                return 'alert alert-info';
            case AlertType.Warning:
                return 'alert alert-warning';
        }
    }
}
