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
  MatCheckboxModule,
  MatBadgeModule
} from '@angular/material';
import { FormComponent } from '../../components/shop-item-form/shop-item-form.component';
import { LoaderService } from '../../services/loader.service';
import { ShopItemFilterPipe } from '../../shared/model/shop-item-filter.pipe';
import { UserService } from '../../services/user.service';
import { ApproveComponent } from 'app/components/approve/approve-item-form.component';
import { EventComponent } from 'app/event/event.component';
import { ImagePreviewComponent } from 'app/image-preview/image-preview.component';
import { PerformanceComponent } from 'app/performance/performance.component';
import { UserEditComponent } from 'app/components/user/user-edit-form.component';
import { VideoComponent } from 'app/components/media/video/video-item-form.component';
import { ImageComponent } from 'app/components/media/image/image-item-form.component';
import { NgxGalleryModule } from 'ngx-gallery';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    MatButtonModule,
    MatBadgeModule,
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
    MatCheckboxModule,
    NgxGalleryModule
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
    FormComponent,
    ApproveComponent,
    EventComponent,
    ImagePreviewComponent,
    PerformanceComponent,
    UserEditComponent,
    VideoComponent,
    ImageComponent
  ],
  providers: [LoaderService, UserService]
  , entryComponents: [
    FormComponent,
    ImagePreviewComponent,
    PerformanceComponent
]
})

export class AdminLayoutModule {}
