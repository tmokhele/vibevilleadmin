import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { AuthGuard } from '../../shared/guards/auth-guard';
import { FormComponent } from 'app/components/shop-item-form/shop-item-form.component';
import { ApproveComponent } from 'app/components/approve/approve-item-form.component';
import { EventComponent } from 'app/event/event.component';
import { EventGuard } from 'app/shared/guards/event-guard';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent , canActivate: [AuthGuard]},
    { path: 'user-profile',   component: UserProfileComponent, canActivate: [AuthGuard] },
    { path: 'venue',     component: TableListComponent, canActivate: [AuthGuard] },
    { path: 'addUser',     component: TypographyComponent , canActivate: [AuthGuard]},
    { path: 'icons',          component: IconsComponent , canActivate: [AuthGuard]},
    { path: 'maps',           component: MapsComponent , canActivate: [AuthGuard]},
    { path: 'event',           component: FormComponent , canActivate: [AuthGuard]},
    { path: 'notifications',  component: NotificationsComponent , canActivate: [AuthGuard]},
    { path: 'approve',  component: ApproveComponent , canActivate: [AuthGuard]},
    { path: 'editEvent',  component: EventComponent , canActivate: [AuthGuard, EventGuard]},
    { path: 'logout',        component: UpgradeComponent , canActivate: [AuthGuard]},
];
