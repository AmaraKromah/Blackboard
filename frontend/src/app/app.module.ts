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

@NgModule({
  declarations: [
    AppComponent,
    ListEducationComponent,
    CreateEducationComponent,
    HomeComponent,
    NotFoundComponent,
    ServerErrorComponent,
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
    //# libs
    ReactiveFormsModule,
    //# add to features
    NbCardModule,
    NbInputModule,
    NbButtonModule,
    NbListModule,
    NbTreeGridModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
