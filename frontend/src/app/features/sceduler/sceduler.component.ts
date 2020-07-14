import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  TemplateRef,
  OnDestroy,
} from '@angular/core';
import { isSameDay, isSameMonth, format, addMinutes, addHours } from 'date-fns';
// import { nl } from 'date-fns/locale';
import {
  CalendarView,
  DAYS_OF_WEEK,
  CalendarDateFormatter,
  CalendarEvent,
  CalendarEventTitleFormatter,
} from 'angular-calendar';
import { Subject, Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomDateFormatter } from './scedule-utils/custom-date-formatter';
import { SceduleService } from 'src/app/core/services/scedule.service';
import { IScedule } from 'src/app/core/model/scedule.model';
import { colors } from './scedule-utils/colors';
import { NbDialogService } from '@nebular/theme';
import { CustomEventTitleFormatter } from './scedule-utils/custom-event-title-formatter.provider';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TaskType } from 'src/app/shared/helpers/task_types';
import {
  DatepickerDateCustomClasses,
  BsDaterangepickerConfig,
} from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-sceduler',
  templateUrl: './sceduler.component.html',
  styleUrls: ['./sceduler.component.scss'],
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
export class ScedulerComponent implements OnInit, OnDestroy {
  //-form related
  sceduleForm: FormGroup;
  taskType = Object.keys(TaskType);
  //-date and timepicker
  minbeginDate: Date;
  minEndDate: Date;
  minEndTime: Date;
  minuteStep: number;
  dateCustomClasses: DatepickerDateCustomClasses[];
  viewType: string;
  //-Calendar
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

  private destroy$ = new Subject();
  private color: any;
  // exclude weekends
  excludeDays: number[] = [0, 6];

  events$: Observable<CalendarEvent<{ scedule: IScedule }>[]>;
  bsConfig;
  bsConf: BsDaterangepickerConfig;
  constructor(
    private fb: FormBuilder,
    private sceduleService: SceduleService,
    private dialogService: NbDialogService
  ) {
    //verplaatsen naar init
    this.minbeginDate = new Date();
    this.minEndDate = new Date();
    // this.minEndTime = new Date()
    this.minEndTime = new Date(addMinutes(new Date(), 10));
    this.minuteStep = 5;
    this.bsConfig = {
      isAnimated: true,
      adaptivePosition: true,
      containerClass: 'theme-dark-blue',
      dateInputFormat: 'DD/MM/YYYY',
    };
    this.dateCustomClasses = [
      { date: new Date(), classes: ['bg-success', 'text-light'] },
    ];
  }
  responsiveWeek(daysInWeek: number) {
    this.daysInWeek = daysInWeek;
  }
  ngOnInit() {
    this.sceduleForm = this.fb.group({
      subject: [''],
      classroom: [''],
      type: [''],
      beginDate: [''],
      beginTime: [''],
      endDate: [''],
      endTime: [''],
    });
    this.fetchEvents();
  }
  fetchEvents(): void {
    this.events$ = this.sceduleService.getSceduletList().pipe(
      map((results: IScedule[]) => {
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

  dayClicked(
    {
      date,
      events,
    }: {
      date: Date;
      events: CalendarEvent<{ scedule: IScedule }>[];
    },
    dialog?: TemplateRef<any>
  ): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
    this.sceduleForm.reset();
    this.sceduleForm.patchValue({
      type: this.taskType[2], //regular
      beginDate: date,
      endDate: date,
      beginTime: addHours(date, 12),
      endTime: addMinutes(addHours(date, 12), 15),
    });
    this.showDailog(dialog);
  }
  hourSegmentClicked(selectedDateTime: Date, dialog: TemplateRef<any>) {
    this.sceduleForm.reset();
    this.sceduleForm.patchValue({
      beginDate: selectedDateTime,
      endDate: selectedDateTime,
      beginTime: selectedDateTime,
      endTime: addMinutes(selectedDateTime, 15),
    });
    this.showDailog(dialog);
  }
  eventClicked(
    event: CalendarEvent<{ scedule: IScedule }>,
    dialog?: TemplateRef<any>
  ): void {
    const scedule: IScedule = event.meta.scedule;
    this.sceduleForm.patchValue({
      subject: scedule.subject.name,
      type: scedule.type,
      classroom: scedule.classroom,
      beginDate: new Date(scedule.beginDateTime),
      endDate: new Date(scedule.endDateTime),
      beginTime: new Date(scedule.beginDateTime),
      endTime: new Date(scedule.endDateTime),
    });
    this.showDailog(dialog, event);
  }

  private showDailog(
    dialog: TemplateRef<any>,
    event?: CalendarEvent<{ scedule: IScedule }>
  ) {
    if (event) {
      this.viewType = 'show';
      const scedule: IScedule = event.meta.scedule;
      this.dialogService.open(dialog, {
        context: {
          date: new DatePipe(this.locale).transform(
            scedule.beginDateTime,
            'EEEE, dd MMMM yyyy',
            this.locale
          ),
        },
      });
    } else {
      this.viewType = 'add';
      this.dialogService.open(dialog, {});
    }
  }

  changeDayView(date: Date, view: string) {
    this.viewDate = date;
    this.view =
      view.trim().toLowerCase() === 'w' ? CalendarView.Week : CalendarView.Day;
  }
  onBeginDateValueChange$(value: Date): void {
    const date: Date = value;
    if (date) {
      this.minEndDate.setDate(date.getDate());
      this.sceduleForm.patchValue({
        endDate: format(date, 'dd/MM/yyyy'),
      });
    }
  }
  minEndTimeValueChanged$(): void {
    const beginTime = new Date(this.beginTime.value);
    this.minEndTime = addMinutes(beginTime, 10);
    this.sceduleForm.patchValue({
      endTime: addMinutes(this.minEndTime, 5),
    });
  }

  //getters and setters
  get subject() {
    return this.sceduleForm.get('subject');
  }
  get classroom() {
    return this.sceduleForm.get('classroom');
  }
  get type() {
    return this.sceduleForm.get('type');
  }
  get beginDate() {
    return this.sceduleForm.get('beginDate');
  }
  get endDate() {
    return this.sceduleForm.get('endDate');
  }
  get beginTime() {
    return this.sceduleForm.get('beginTime');
  }
  get endTime() {
    return this.sceduleForm.get('endTime');
  }
  ngOnDestroy() {
    this.destroy$.next();
  }
}
