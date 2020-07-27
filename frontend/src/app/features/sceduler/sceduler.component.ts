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
  taskTypes = Object.keys(TaskType);
  subjectNames$: Observable<{ _id: string; name: string }[]>;
  sceduleSub: Subscription;
  isRepeated: boolean;
  repeats: boolean = false;
  updateAll: boolean = false;
  private repeatID: string;
  //-date and timepicker
  minbeginDate: Date;
  minEndDate: Date;
  minEndTime: Date;
  minuteStep: number;
  dateCustomClasses: DatepickerDateCustomClasses[];
  viewType: string;
  bsConfig: object;
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
  //apart in shared?
  weekDays: any[] = [
    { day: 0, name: 'Monday' },
    { day: 1, name: 'Tuesday' },
    { day: 2, name: 'Wednesday' },
    { day: 3, name: 'Thursday' },
    { day: 4, name: 'Friday' },
    { day: 5, name: 'Saturday' },
    { day: 6, name: 'Sunday' },
  ];
  private destroy$ = new Subject();
  private color: any;
  private sceduleID: string;
  // exclude weekends
  excludeDays: number[] = [0, 6];

  events$: Observable<CalendarEvent<{ scedule: IScedule }>[]>;
  //change timezone accordingly
  constructor(
    private fb: FormBuilder,
    private subjService: SubjectService,
    private sceduleService: SceduleService,
    private dialogService: NbDialogService,
    private utility: UtilityService
  ) {}
  stuff: string[];
  ngOnInit() {
    this.sceduleForm = this.fb.group({
      subject: [''],
      classroom: [''],
      type: [''],
      beginDate: [''],
      beginTime: [''],
      endDate: [''],
      endTime: [''],
      recurWeekDay: [['']],
    });
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

    this.sceduleSub = this.sceduleService.sceduleRefreshNeeded$.subscribe(
      () => {
        this.fetchEvents();
        this.fetchSubjects();
        this.repeats = false;
        this.updateAll = false;
        this.sceduleID = null;
        this.refresh.next();
      }
    );
    this.fetchEvents();
    this.fetchSubjects();
  }
  //-deal with empty array
  fetchSubjects(): void {
    this.subjectNames$ = this.subjService.getSubjectList().pipe(
      map(({ subjects }: { subjects: ISubject[] }) => {
        return subjects.map((subject: ISubject) => {
          return {
            _id: subject._id,
            name: subject.name,
          };
        });
      })
    );
  }
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
    let daySelect = getDay(date) == 0 ? 6 : getDay(date) - 1;
    this.sceduleForm.reset();
    this.minEndTime = addHours(date, 12);
    this.sceduleForm.patchValue({
      type: this.taskTypes[2], //regular
      beginDate: date,
      endDate: new Date(date),
      beginTime: addHours(date, 12),
      endTime: addMinutes(addHours(date, 12), 15),
      recurWeekDay: [daySelect],
    });
    this.showDailog(dialog);
  }

  hourSegmentClicked(selectedDateTime: Date, dialog: TemplateRef<any>) {
    this.sceduleForm.reset();
    this.minEndTime = selectedDateTime;
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
    this.sceduleForm.reset();

    let daySelect =
      getDay(new Date(scedule.beginDateTime)) == 0
        ? 6
        : getDay(new Date(scedule.beginDateTime)) - 1;
    this.sceduleForm.patchValue({
      subject: scedule.subject._id,
      type: scedule.type,
      classroom: scedule.classroom,
      beginDate: new Date(scedule.beginDateTime),
      endDate: new Date(scedule.endDateTime),
      beginTime: new Date(scedule.beginDateTime),
      endTime: new Date(scedule.endDateTime),
      recurWeekDay: [daySelect],
    });
    this.minEndTime = this.beginTime.value;
    this.sceduleID = scedule._id;
    this.isRepeated = scedule.repeated;
    this.repeatID = scedule.repeatID;
    this.showDailog(dialog, event);
  }

  onSubmit() {
    ///////////////////////////////////
    let beginDate = this.utility
        .convertAnytoDate(this.beginDate.value)
        .toDateString(),
      beginTime = new Date(this.beginTime.value).toTimeString();
    let endDate = this.utility
        .convertAnytoDate(this.endDate.value)
        .toDateString(),
      endTime = new Date(this.endTime.value).toTimeString();
    const beginDateTime = new Date(`${beginDate} ${beginTime}`),
      endDateTime = new Date(`${endDate} ${endTime}`),
      repeatedDates: { beginDateTime: Date; endDateTime: Date }[] = [];
    ///////////////////////////////////////////
    if (this.sceduleForm.valid) {
      const rule = new RRule({
        freq: RRule.WEEKLY,
        interval: 1,
        byweekday: this.recurWeekDay.value,
        dtstart: beginDateTime,
        until: endDateTime,
      });
      if (this.repeats) {
        rule.all().forEach((rrBeginDateTime: Date) => {
          let rrbeginDate = rrBeginDateTime.toDateString(),
            repeatEndDateTime: Date = new Date(`${rrbeginDate}  ${endTime}`);
          repeatedDates.push({
            beginDateTime: rrBeginDateTime,
            endDateTime: repeatEndDateTime,
          });
        });
      }
      let addScedule: IScedule = {
        _id: null,
        subject: this.subject.value,
        classroom: this.classroom.value,
        type: this.type.value,
        beginDateTime,
        endDateTime,
        repeated: this.repeats,
        repeatedDates,
        occurenceText: this.repeats ? rule.toText() : '',
      };
      let editScedule = addScedule;
      editScedule._id = this.sceduleID;
      editScedule.updateAll = this.updateAll;
      editScedule.repeatID = this.repeatID;

      this.sceduleID
        ? this.sceduleService.updateScedules(editScedule)
        : this.sceduleService.addScedules(addScedule);
    }
  }
  onDelete(deleteOption?: number) {
    const deleteDates = {
      beginDateTime: this.beginDate.value,
      endDateTime: this.endDate.value,
    };
    // #delete sequence
    deleteOption >= 0
      ? this.sceduleService.deleteScedudle(
          this.sceduleID,
          deleteDates,
          deleteOption
        )
      : // #deleteSIngle
        this.sceduleService.deleteScedudle(this.sceduleID);
  }
  minEndTimeValueChanged$(): void {
    const beginTime = new Date(this.beginTime.value);
    this.minEndTime = beginTime;
    this.sceduleForm.patchValue({
      endTime: addMinutes(beginTime, 15),
    });
  }
  onBeginDateValueChange$(value: Date): void {
    const date: Date = value;
    if (date) {
      this.minEndDate = date;
      this.minEndDate.setDate(date.getDate());
      this.sceduleForm.patchValue({
        endDate: format(date, 'dd/MM/yyyy'),
      });
    }
  }
  changeDayView(date: Date, view: string) {
    this.viewDate = date;
    this.view =
      view.trim().toLowerCase() === 'w' ? CalendarView.Week : CalendarView.Day;
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
          subject: scedule.subject.name,
          occurenceText: scedule.occurenceText,
        },
      });
    } else {
      this.viewType = 'add';
      this.dialogService.open(dialog, {});
    }
  }
  //getters
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
  get recurWeekDay() {
    return this.sceduleForm.get('recurWeekDay');
  }
  ngOnDestroy() {
    this.destroy$.next(); //verwijderen ?
    this.sceduleSub.unsubscribe();
  }
}
