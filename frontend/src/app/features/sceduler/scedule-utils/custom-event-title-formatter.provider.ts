import { LOCALE_ID, Inject, Injectable } from '@angular/core';
import { CalendarEventTitleFormatter, CalendarEvent } from 'angular-calendar';
import { DatePipe } from '@angular/common';

@Injectable()
export class CustomEventTitleFormatter extends CalendarEventTitleFormatter {
  constructor(@Inject(LOCALE_ID) private locale: string) {
    super();
  }

  // you can override any of the methods defined in the parent class

  month(event: CalendarEvent): string {
    return `<b>${new DatePipe(this.locale).transform(
      event.start,
      'HH:mm',
      this.locale
    )}</b> &nbsp;- ${event.title}, &nbsp; ${event.meta.scedule.classroom}`;
  }

  week(event: CalendarEvent): string {
    return ` <b>${event.title}</b><br/>
    ${new DatePipe(this.locale).transform(
      event.start,
      'HH:mm',
      this.locale
    )}, ${event.meta.scedule.classroom}`;
  }

  day(event: CalendarEvent): string {
    return ` <b>${event.title}</b><br/>
    ${new DatePipe(this.locale).transform(
      event.start,
      'HH:mm',
      this.locale
    )}, ${event.meta.scedule.classroom}`;
  }
}
