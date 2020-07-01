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
  // NbToastrModule,
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

import { ListEducationComponent } from './features/content/education/list-education.component';
import { CreateEducationComponent } from './features/content/education/create-education.component';
import { HomeComponent } from './features/home/home.component';
import { NotFoundComponent } from './core/components/not-found/not-found.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ServerErrorComponent } from './core/components/server-error/server-error.component';
import { CreateSubjectComponent } from './features/content/subject/create-subject.component';
import { ListSubjectComponent } from './features/content/subject/list-subject.component';
import { ListAssignmentComponent } from './features/content/assignment/list-assignment.component';
import { CreateAssignmentComponent } from './features/content/assignment/create-assignment.component';
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
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CookieService } from 'ngx-cookie-service';

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
    // NbToastrModule.forRoot(),
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
    // FlashMessagesModule.forRoot(),
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

    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  providers: [
    CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
