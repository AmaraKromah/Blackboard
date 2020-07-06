import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import {
  CalendarView,
  DAYS_OF_WEEK,
  CalendarDateFormatter,
  CalendarEvent,
  CalendarEventAction,
} from 'angular-calendar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CustomDateFormatter } from './custom-date-formatter';
import { EventHandlerVars } from '@angular/compiler/src/compiler_util/expression_converter';
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
  ],
})
export class ScedulerComponent implements OnInit {
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  daysInWeek: number = 7;
  locale: string = 'en-nl';
  weekStartsOn: number = DAYS_OF_WEEK.MONDAY;
  startHour: number = 7;
  endHour: number = 20;
  events: CalendarEvent[] = [];
  actions: CalendarEventAction[] = [];

  private destroy$ = new Subject();
  // exclude weekends
  excludeDays: number[] = [0, 6];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private cd: ChangeDetectorRef
  ) {}
  ngOnInit() {
    this.updateBreakpoint();
    this.calanderEventsHandler();
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  changeDayView(date: Date, view: string) {
    this.viewDate = date;
    this.view =
      view.trim().toLowerCase() === 'w' ? CalendarView.Week : CalendarView.Day;
  }

  calanderEventsHandler() {
    this.events = [
      {
        title: 'An all day event',
        color: {
          primary: '#3366FF',
          secondary: '#D1E8FF',
        },
        start: new Date(),
        allDay: true,
      },
      {
        title: 'A non all day event',
        color: {
          primary: '#3366FF',
          secondary: '#D1E8FF',
        },
        start: new Date(),
      },
    ];
  }
  updateBreakpoint() {
    const CALENDAR_RESPONSIVE = {
      small: {
        breakpoint: '(max-width: 576px)',
        daysInWeek: 2,
      },
      medium: {
        breakpoint: '(max-width: 768px)',
        daysInWeek: 3,
      },
      large: {
        breakpoint: '(max-width: 960px)',
        daysInWeek: 7,
      },
    };

    this.breakpointObserver
      .observe(
        Object.values(CALENDAR_RESPONSIVE).map(({ breakpoint }) => breakpoint)
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: BreakpointState) => {
        const foundBreakpoint = Object.values(CALENDAR_RESPONSIVE).find(
          ({ breakpoint }) => !!state.breakpoints[breakpoint]
        );
        if (foundBreakpoint) {
          this.daysInWeek = foundBreakpoint.daysInWeek;
        } else {
          this.daysInWeek = 5;
        }
        this.cd.markForCheck();
      });
  }
  ngOnDestroy() {
    this.destroy$.next();
  }
}
