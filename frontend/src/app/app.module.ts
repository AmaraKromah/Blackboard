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
  NbInfiniteListDirective,
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
import { NotFoundComponent } from './core/not-found/not-found.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ServerErrorComponent } from './core/server-error/server-error.component';
import { CreateSubjectComponent } from './features/subject/create-subject.component';
import { ListSubjectComponent } from './features/subject/list-subject.component';
import { ListAssignmentComponent } from './features/assignment/list-assignment.component';
import { CreateAssignmentComponent } from './features/assignment/create-assignment.component';
import { LoginComponent } from './core/auth/login/login.component';
import { RegisterComponent } from './core/auth/register/register.component';
import { RequestPasswordComponent } from './core/auth/request-password/request-password.component';
import { ResetPasswordComponent } from './core/auth/reset-password/reset-password.component';

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
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
