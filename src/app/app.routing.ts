import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthGuard } from './components/auth/auth.guard';
import { LoginComponent } from './components/auth/login/login.component';
import { RegistrationComponent } from './components/auth/registration/registration.component';
import { PasswordResetComponent } from './components/auth/passwordreset/passwordreset.component';
import { PasswordConfirmComponent } from './components/auth/confirm/passwordconfirm.component';

const routes: Routes =
  [
    { path: 'login', component: LoginComponent },
    {
      path: '',
      redirectTo: 'login',
      pathMatch: 'full',
    },
    {
      path: 'register',
      redirectTo: 'register',
      pathMatch: 'full',
    },
    {
      path: 'reset',
      redirectTo: 'reset',
      pathMatch: 'full',
    },
    {
      path: 'confirm',
      redirectTo: 'confirm'
    },
    {
      path: '',
      component: AdminLayoutComponent,
      children: [
        {
          path: '',
          loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule'
        }],
    }, { path: 'register', component: RegistrationComponent },
    { path: 'reset', component: PasswordResetComponent },
    { path: 'confirm:mode&:oobCode&:lang', component: PasswordConfirmComponent }
  ];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
  ],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
