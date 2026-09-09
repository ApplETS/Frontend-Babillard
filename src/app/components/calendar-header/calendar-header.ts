import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, model, Output, WritableSignal } from '@angular/core';
import { TimeGridType, CalendarAction } from '@components/calendar/calendar';
import { DropDownSelectComponent } from '@components/drop-down-select.component/drop-down-select.component';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faChevronLeft, faChevronRight, faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { TranslocoDatePipe } from '@jsverse/transloco-locale';
import { ActivityAreaDisplay } from '@services/activityAreaService/activity-area.service';

@Component({
  selector: 'app-calendar-header',
  imports: [FaIconComponent, DropDownSelectComponent, CommonModule, TranslocoPipe, TranslocoDatePipe],
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
  activityAreas = model<ActivityAreaDisplay[] | null>(null);
  @Output() calendarChanged = new EventEmitter<CalendarAction>();
  translateService = inject(TranslocoService);

  handleDateChange(action: CalendarAction): void {
    this.calendarChanged.emit(action);
  }

  handleViewChange(view: TimeGridType): void {
    this.viewType.set(view);
  }
}