import { Component, computed, input, model, output } from "@angular/core";
import { TranslocoDirective } from "@jsverse/transloco";
import { PaginatedResponse, PaginationParameters } from "@services/apiService/api.service";
import { FormValueControl } from "@angular/forms/signals";

@Component({
  selector: "app-pagination",
  imports: [TranslocoDirective],
  templateUrl: "./pagination.html",
})
export class Pagination implements FormValueControl<PaginationParameters> {
  value = model.required<PaginationParameters>();

  paginationResponse = input.required<PaginatedResponse<unknown>>();
  changed = output<PaginationParameters>();

  pageSizes = [10, 20, 30, 40, 50];

  protected verifyPageNumber(value: number) {
    let effectiveValue: number;
    if (value < 1) {
      effectiveValue = 1;
    } else if (value > this.paginationResponse().totalPages) {
      effectiveValue = this.paginationResponse().totalPages;
    } else {
      effectiveValue = value;
    }
    this.value.update((v) => ({
      ...v,
      pageNumber: effectiveValue,
    }));
    this.changed.emit(this.value());
  }

  protected onPageSizeChangeEvent(e: Event) {
    const newPageSize = Number((e.target as HTMLSelectElement).value);
    this.value.update((v) => ({
      ...v,
      pageSize: newPageSize,
      pageNumber: 1,
    }));
    this.changed.emit(this.value());
  }

  canMoveBack = computed(() => this.paginationResponse().pageNumber > 1);
  canMoveForward = computed(
    () => this.paginationResponse().pageNumber < this.paginationResponse().totalPages,
  );
}
