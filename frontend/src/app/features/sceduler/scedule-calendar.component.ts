import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  TemplateRef,
  OnDestroy,
} from '@angular/core';
import {
  isSameDay,
  isSameMonth,
  format,
  addMinutes,
  addHours,
  getDay,
} from 'date-fns';
import {
  CalendarView,
  DAYS_OF_WEEK,
  CalendarDateFormatter,
  CalendarEvent,
  CalendarEventTitleFormatter,
} from 'angular-calendar';
import { Subject, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomDateFormatter } from './scedule-utils/custom-date-formatter';
import { SceduleService } from 'src/app/core/services/scedule.service';
import { colors } from './scedule-utils/colors';
import { NbDialogService } from '@nebular/theme';
import { CustomEventTitleFormatter } from './scedule-utils/custom-event-title-formatter.provider';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TaskType } from 'src/app/shared/helpers/task_types';
import { DatepickerDateCustomClasses } from 'ngx-bootstrap/datepicker';
import { IScedule } from 'src/app/core/model/scedule.model';
import { ISubject } from '../../core/model/subject.model';
import { SubjectService } from '../../core/services/subject.service';
import { UtilityService } from '../../shared/utilities/utility.service';
import { RRule } from 'rrule';
@Component({
  selector: 'app-scedule-calendar',
  templateUrl: './scedule-calendar.component.html',
  styleUrls: ['./scedule-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
    {
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventTitleFormatter,
    },
  ],
})
export class SceduleCalendarComponent implements OnInit {
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  daysInWeek: number = 7;
  locale: string = 'nl';
  weekStartsOn: number = DAYS_OF_WEEK.MONDAY;
  startHour: number = 7;
  endHour: number = 20;
  refresh: Subject<any> = new Subject();
  activeDayIsOpen: boolean = false;
  excludeDays: number[] = [0, 6];
  events$: Observable<CalendarEvent<{ scedule: IScedule }>[]>;
  private destroy$ = new Subject();
  private color: any;
  constructor(
    private sceduleService: SceduleService,

  ) {}

  ngOnInit(): void {}


  fetchEvents(): void {
    this.events$ = this.sceduleService.getSceduletList().pipe(
      map((results: IScedule[]) => {
        this.refresh.next();
        return results.map((scedule: IScedule) => {
          if (scedule.type === 'practicum') this.color = colors.yellow;
          if (scedule.type === 'hoorcollege') this.color = colors.blue;
          if (scedule.type === 'regular') this.color = colors.red;
          return {
            title: `${scedule.subject.name}`,
            start: new Date(scedule.beginDateTime),
            end: new Date(scedule.endDateTime),
            color: this.color,
            allDay: false,
            meta: {
              scedule,
            },
          };
        });
      })
    );
  }

  hourSegmentClicked(selectedDateTime: Date, dialog: TemplateRef<any>) {
    // this.sceduleForm.reset();
    // this.minEndTime = selectedDateTime;
    // this.sceduleForm.patchValue({
    //   beginDate: selectedDateTime,
    //   endDate: selectedDateTime,
    //   beginTime: selectedDateTime,
    //   endTime: addMinutes(selectedDateTime, 15),
    // });
    // this.showDailog(dialog);
  }
  
}
