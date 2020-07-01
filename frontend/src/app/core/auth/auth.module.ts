import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NbToastrModule,
  NbCardModule,
  NbInputModule,
  NbButtonModule,
  NbIconModule,
  NbCheckboxModule,
} from '@nebular/theme';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RequestPasswordComponent } from './request-password/request-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ComfirmRegistrationComponent } from './register/comfirm-registration.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    RequestPasswordComponent,
    ResetPasswordComponent,
    ComfirmRegistrationComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FlashMessagesModule.forRoot(),
    // NbToastrModule.forRoot(),
    NbCardModule,
    NbInputModule,
    NbButtonModule,
    NbToastrModule,
    NbCheckboxModule,
    NbIconModule,
    AuthRoutingModule,
  ],
})
export class AuthModule {}
