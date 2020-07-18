import { Injectable } from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  constructor(private router: Router) {}

  //# -----------  WINDOW ---------------//

  openLinkInNewTab(link: string) {
    let url = '';
    if (!/^http[s]?:\/\//.test(link)) {
      url += 'http://';
    }

    url += link;
    window.open(url, '_blank');
  }

  scrollToTop() {
    // window.scroll(0, 0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  //# -----------  CONVERSIONS ---------------//

  convertDateToNumberFormat(d: Date) {
    const formattedTime =
      (d.getHours() < 10 ? '0' + d.getHours() : d.getHours()) +
      '' +
      (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes());
    return +formattedTime;
  }

  timeToObject(startTime, endTime) {
    return {
      open: this.convertDateToNumberFormat(startTime),
      close: this.convertDateToNumberFormat(endTime),
    };
  }

  convertNumberToDateFormat(time_in_number) {
    const finalTime = new Date();
    const hourAndMinute = time_in_number.toString().match(/.{1,2}/g);
    finalTime.setHours(+hourAndMinute[0]);
    finalTime.setMinutes(+hourAndMinute[1]);
    return finalTime;
  }

  arrayOfStringsToArrayOfObjects(arr: any[]) {
    const newArray = [];
    arr.forEach((element) => {
      newArray.push({
        label: element,
        value: element,
      });
    });
    return newArray;
  }

  arrayOfObjectToArrayOfStrings(obj: []) {
    const newArray = [];
    obj.forEach((element) => {
      newArray.push(element['value']);
    });
    return newArray;
  }

  checkAndParseToNumberIfString(str: string) {
    if (typeof str === 'string') {
      return this.stringToNumber(str);
    } else {
      return str;
    }
  }
  stringToNumber(str: string) {
    return +str;
  }
  convertSanitizedToHtml(input: string) {
    var e = document.createElement('div');
    e.innerHTML = input;
    return input
      ? e.childNodes[0].nodeValue
        ? e.childNodes[0].nodeValue
        : input
      : '';
  }

  convertAnytoDate(date: any): Date {
    if (typeof date === 'string') {
      let dateArray = date.split('/').map((item: string) => parseInt(item));
      return new Date(dateArray[2], dateArray[1] - 1, dateArray[0]);
    } else {
      return new Date(date);
    }
  }
  //# -----------  CHECKS ---------------//

  checkNumberOnly(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && charCode !== 43 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  checkLengthOfEveryArrayInObject(obj) {
    if (obj) {
      for (const val of Object.values(obj)) {
        if (val['length'] === 0) {
          return false;
        } else {
          return true;
        }
      }
    }
  }

  checkIsObjectEmpty(obj: object) {
    return Object.entries(obj).length === 0 && obj.constructor === Object;
  }

  //# -----------  OTHER UTILITIES ---------------//

  pickPartialObject(properties: string[], objectToFilter) {
    const partailObject = properties.reduce((o, k) => {
      o[k] = objectToFilter[k];
      return o;
    }, {});

    return partailObject;
  }

  // generate 4 digit randome number
  getRandomId() {
    return Math.floor(1000 + Math.random() * 9000);
  }
}
