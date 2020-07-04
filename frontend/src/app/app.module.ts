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
  NbCardModule,
  NbInputModule,
  NbButtonModule,
  NbSelectModule,
  NbIconModule,
  NbActionsModule,
  NbContextMenuModule,
  NbUserModule,
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbDateFnsDateModule } from '@nebular/date-fns';
import { HomeComponent } from './features/home/home.component';
import { NotFoundComponent } from './core/components/not-found/not-found.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ServerErrorComponent } from './core/components/server-error/server-error.component';
import { HttpTokenInterceptor } from './core/interceptors/http-interceptor/http-token-interceptor';
import { HttpErrorInterceptor } from './core/interceptors/http-interceptor/http-error-interceptor';
import { HeaderComponent } from './core/components/header/header.component';
import { FooterComponent } from './core/components/footer/footer.component';
import { SidenavComponent } from './core/components/sidenav/sidenav.component';
import { DashboardLayoutComponent } from './core/layouts/dashboard-layout/dashboard-layout.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CookieService } from 'ngx-cookie-service';
import { MainComponent } from './pages/main/main.component';
import { HomeLayoutComponent } from './core/layouts/home-layout/home-layout.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotFoundComponent,
    ServerErrorComponent,
    HeaderComponent,
    FooterComponent,
    SidenavComponent,
    DashboardLayoutComponent,
    MainComponent,
    HomeLayoutComponent,
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
    // NbInputModule,
    NbButtonModule,
    NbMenuModule,
    //-uses by task
    NbDialogModule.forChild(),
    //-used for assignment

    //- header
    NbIconModule,
    NbActionsModule,
    NbMenuModule.forRoot(),
    NbContextMenuModule,
    NbUserModule,
    //-sidenav
    NbMenuModule.forRoot(),
    NbMenuModule,

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
