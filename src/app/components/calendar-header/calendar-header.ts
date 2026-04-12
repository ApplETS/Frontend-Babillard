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
  @Input({required: true}) currentDate!: moment.Moment;
  @Output() calendarChanged = new EventEmitter<CalendarAction>();

  handleDateChange(action: CalendarAction): void {
    this.calendarChanged.emit(action);
  }

  handleViewChange(view: TimeGridType): void {
    this.viewType.set(view);
  }

  get timeFrame(): string {
    switch (this.viewType()) {
      case TimeGridType.month:
        return this.currentDate.format("MMMM YYYY");
      case TimeGridType.week:
        const startOfWeek = this.currentDate.clone().startOf('week').format("D MMM");
        const endOfWeek = this.currentDate.clone().endOf('week').format("D MMM YYYY");
        return `${startOfWeek} - ${endOfWeek}`;
      case TimeGridType.day:
        return this.currentDate.format("D MMM YYYY");
      default:
        return "";
    }
  }
}