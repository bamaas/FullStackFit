import { NativeDateAdapter } from '@angular/material';
import { formatDate } from '@angular/common';
import { Injectable} from '@angular/core';

export const PICK_FORMATS = {
  parse: {dateInput: {month: 'short', year: 'numeric', day: 'numeric'}},
  display: {
      dateInput: 'input',
      monthYearLabel: {year: 'numeric', month: 'short'},
      dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
      monthYearA11yLabel: {year: 'numeric', month: 'long'}
  }
};

@Injectable()
export class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
      if (displayFormat === 'input') {
          return formatDate(date,'dd-MM-yyyy',this.locale);;
      } else {
          return date.toDateString();
      }
  }
}