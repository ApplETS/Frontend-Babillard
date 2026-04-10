import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DropDownSelectComponent } from '@components/drop-down-select.component/drop-down-select.component';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faChevronLeft, faChevronRight, faCalendarDay } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-calendar-header',
  imports: [FaIconComponent, DropDownSelectComponent, CommonModule],
  templateUrl: './calendar-header.html',
})
export class CalendarHeader {
  readonly faChevronLeft = faChevronLeft;
  readonly faChevronRight = faChevronRight;
  readonly faCalendarDay = faCalendarDay;
  readonly CalendarAction = CalendarAction;
  readonly TimeGridType = TimeGridType;

  viewType: TimeGridType = TimeGridType.month;

  handleDateChange(action: CalendarAction): void {
    
  }

  handleViewChange(view: TimeGridType): void {
    this.viewType = view;
  }
}

export enum TimeGridType{
  month = "dayGridMonth",
  week = "timeGridWeek",
  day = "timeGridDay"
} 

export enum CalendarAction {
  previous = "prev",
  next = "next",
  today = "today"
}