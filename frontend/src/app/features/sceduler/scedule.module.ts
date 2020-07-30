import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NbCardModule,
  NbInputModule,
  NbSelectModule,
  NbDialogModule,
  NbDatepickerModule,
  NbCheckboxModule,
  NbIconModule,
  NbButtonModule,
} from '@nebular/theme';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
//ngx bootstrap
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { SceduleRoutingModule } from './scedule-routing.module';
import localeNl from '@angular/common/locales/nl';
import { registerLocaleData } from '@angular/common';
import { SceduleCalendarComponent } from './scedule-calendar.component';
import { SceduleHeaderComponent } from './scedule-utils/scedule-header.component';
import { ScedulerComponent } from './sceduler.component';

registerLocaleData(localeNl);
@NgModule({
  declarations: [
    ScedulerComponent,
    SceduleHeaderComponent,
    SceduleCalendarComponent,
  ],
  imports: [
    CommonModule,
    SceduleRoutingModule,
    ReactiveFormsModule,
    RouterModule,
    NbCardModule,
    NbInputModule,
    NbSelectModule,
    NbDialogModule.forChild(),
    NbDatepickerModule,
    NbCheckboxModule,
    NbIconModule,
    NbButtonModule,
    //calender
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    //bootstrap ngx
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
  ],
})
export class SceduleModule {}
