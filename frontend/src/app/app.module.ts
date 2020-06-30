import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  NbThemeModule,
  NbLayoutModule,
  NbSidebarModule,
  NbMenuModule,
  NbDatepickerModule,
  NbDialogModule,
  NbWindowModule,
  NbToastrModule,
  NbCardModule,
  NbInputModule,
  NbButtonModule,
  NbListModule,
  NbTreeGridModule,
  NbSelectModule,
  NbTabsetModule,
  NbRouteTabsetModule,
  NbIconModule,
  NbCheckboxModule,
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbDateFnsDateModule } from '@nebular/date-fns';
import { ListEducationComponent } from './features/education/list-education.component';
import { CreateEducationComponent } from './features/education/create-education.component';
import { HomeComponent } from './features/home/home.component';
import { NotFoundComponent } from './core/components/not-found/not-found.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ServerErrorComponent } from './core/components/server-error/server-error.component';
import { CreateSubjectComponent } from './features/subject/create-subject.component';
import { ListSubjectComponent } from './features/subject/list-subject.component';
import { ListAssignmentComponent } from './features/assignment/list-assignment.component';
import { CreateAssignmentComponent } from './features/assignment/create-assignment.component';
import { LoginComponent } from './core/auth/login/login.component';
import { RegisterComponent } from './core/auth/register/register.component';
import { RequestPasswordComponent } from './core/auth/request-password/request-password.component';
import { ResetPasswordComponent } from './core/auth/reset-password/reset-password.component';
import { ComfirmRegistrationComponent } from './core/auth/register/comfirm-registration.component';
import { HttpTokenInterceptor } from './core/interceptors/http-interceptor/http-token-interceptor';
import { HttpErrorInterceptor } from './core/interceptors/http-interceptor/http-error-interceptor';
import { HeaderComponent } from './core/components/header/header.component';
import { FooterComponent } from './core/components/footer/footer.component';
import { SidenavComponent } from './core/components/sidenav/sidenav.component';
import { DashboardLayoutComponent } from './core/layouts/dashboard-layout/dashboard-layout.component';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { EditorModule } from '@tinymce/tinymce-angular';
import { TextEditorComponent } from './shared/components/text-editor.component';
import { NoSanitizePipe } from './shared/helpers/pipes/no-sanitize.pipe';

@NgModule({
  declarations: [
    AppComponent,
    ListEducationComponent,
    CreateEducationComponent,
    HomeComponent,
    NotFoundComponent,
    ServerErrorComponent,
    CreateSubjectComponent,
    ListSubjectComponent,
    ListAssignmentComponent,
    CreateAssignmentComponent,
    LoginComponent,
    RegisterComponent,
    RequestPasswordComponent,
    ResetPasswordComponent,
    ComfirmRegistrationComponent,
    HeaderComponent,
    FooterComponent,
    SidenavComponent,
    DashboardLayoutComponent,
    TextEditorComponent,
    //wordt enkel gebruik in assignment (verplaats naar eigen module later)
    NoSanitizePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NbThemeModule.forRoot({ name: 'default' }),
    NbLayoutModule,
    NbEvaIconsModule,
    HttpClientModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    NbDateFnsDateModule.forRoot({
      format: 'dd.MM.yyyy',
      parseOptions: {
        useAdditionalWeekYearTokens: true,
        useAdditionalDayOfYearTokens: true,
      },
      formatOptions: {
        useAdditionalWeekYearTokens: true,
        useAdditionalDayOfYearTokens: true,
      },
    }),
    FlashMessagesModule.forRoot(),
    NbDialogModule.forRoot(),

    //# libs
    ReactiveFormsModule,
    //# add to features
    //- Used by edu
    NbCardModule,
    NbInputModule,
    NbButtonModule,
    NbListModule,
    NbTreeGridModule,
    NbMenuModule,
    //- used by subject

    NbSelectModule,
    NbTabsetModule,
    NbIconModule,
    NbCheckboxModule,

    //-uses by task
    NbDialogModule.forChild(),

    //-used for assignment
    EditorModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
