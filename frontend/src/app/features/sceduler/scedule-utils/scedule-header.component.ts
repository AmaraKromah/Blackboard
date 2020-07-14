import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { CalendarView } from 'angular-calendar';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-scedule-header',
  templateUrl: './scedule-header.component.html',
  styleUrls: ['./scedule-header.component.scss'],
})
export class SceduleHeaderComponent implements OnInit, OnDestroy {
  @Input() view: CalendarView;

  @Input() viewDate: Date;

  @Input() locale: string;
  @Input() excludeDays: number[];

  @Output() viewChange = new EventEmitter<CalendarView>();

  @Output() viewDateChange = new EventEmitter<Date>();
  @Output() daysInWeek = new EventEmitter<number>();

  CalendarView = CalendarView;
  //misschien dit ontvangen van buitenwereld
  private destroy$ = new Subject();

  constructor(
    private breakpointObserver: BreakpointObserver,
    private cd: ChangeDetectorRef
  ) {}
  ngOnInit() {
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
        daysInWeek: 5,
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
          this.daysInWeek.emit(foundBreakpoint.daysInWeek);
          this.viewChange.emit(CalendarView.Week);
        } else {
          this.daysInWeek.emit(7);
          this.viewChange.emit(CalendarView.Month);
        }
        this.cd.markForCheck();
      });
  }
  ngOnDestroy() {
    this.destroy$.next();
  }
}
