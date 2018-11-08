import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';


import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';

import { AppComponent } from './app.component';

import {
  AgmCoreModule
} from '@agm/core';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthGuard } from './shared/guards/auth-guard';
import { AuthService } from './components/auth/auth.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginComponent } from './components/auth/login/login.component';
import { MatInputModule, MatCardModule,
  MatIconModule, MatTooltipModule, MatDialogModule, MatButtonModule, MatCheckboxModule } from '@angular/material';
import { ValidationService } from './components/shop-item-form/form-validation.service';
import { VenueService } from './services/venue.service';
import { RequestInterceptor } from './components/auth/request.interceptor';
import { LoaderService } from './services/loader.service';
import { AlertComponent } from './alert/alert-component';
import { AlertService } from './shared/alert';
import { GlobalErrorHandler } from './shared/global-error-handler';
import { RegistrationComponent } from './components/auth/registration/registration.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    ComponentsModule,
    MatButtonModule,
    RouterModule,
    AppRoutingModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    MatCheckboxModule,
    MatIconModule,
    MatTooltipModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC3bXqL1zR_p1tmvSK5J1m9sIZtS0rvGao'
    })
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    LoginComponent,
    AlertComponent,
    RegistrationComponent

  ],

  entryComponents: [
    AlertComponent
],
  providers: [AuthGuard,
    AuthService,
    ValidationService,
    VenueService,
    LoaderService,
    GlobalErrorHandler,
    AlertService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
