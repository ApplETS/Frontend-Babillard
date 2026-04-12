import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, WritableSignal } from '@angular/core';
import { TimeGridType, CalendarAction } from '@components/calendar/calendar';
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

  @Input({required: true}) viewType!: WritableSignal<TimeGridType>;
  @Output() calendarChanged = new EventEmitter<CalendarAction>();

  handleDateChange(action: CalendarAction): void {
    this.calendarChanged.emit(action);
  }

  handleViewChange(view: TimeGridType): void {
    this.viewType.set(view);
  }
}