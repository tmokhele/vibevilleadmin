import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';

import {
  MatButtonModule,
  MatInputModule,
  MatRippleModule,
  MatTooltipModule,
  MatCardModule,
  MatIconModule,
  MatDialogModule,
  MatOptionModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatListModule,
  MatStepperModule,
  MatCheckboxModule
} from '@angular/material';
import { FormComponent } from '../../components/shop-item-form/shop-item-form.component';
import { LoaderService } from '../../services/loader.service';
import { ShopItemFilterPipe } from '../../shared/model/shop-item-filter.pipe';
import { UserService } from '../../services/user.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    MatButtonModule,
    MatRippleModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatListModule,
    MatStepperModule,
    MatCheckboxModule
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    TableListComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,
    UpgradeComponent,
    ShopItemFilterPipe,
    FormComponent
  ],
  providers: [LoaderService,UserService]
  , entryComponents: [
    FormComponent
]
})

export class AdminLayoutModule {}