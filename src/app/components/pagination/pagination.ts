import { Component, computed, input, InputSignal, InputSignalWithTransform, model, ModelSignal, OutputRef } from "@angular/core";
import { TranslocoDirective } from "@jsverse/transloco";
import { PaginatedResponse, PaginationParameters } from "@services/apiService/api.service";
import { FormValueControl } from "@angular/forms/signals";

@Component({
  selector: "app-pagination",
  imports: [TranslocoDirective],
  templateUrl: "./pagination.html",
})
export class Pagination implements FormValueControl<PaginationParameters> {
  value = model<PaginationParameters>({descending: false, orderBy: null, pageNumber: 1, pageSize: 10});

  paginationResponse = input.required<PaginatedResponse<unknown>>();

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
  }

  protected onPageSizeChangeEvent(e: Event) {
    const newPageSize = Number((e.target as HTMLSelectElement).value);
    this.value.update((v) => ({
      ...v,
      pageSize: newPageSize,
      pageNumber: 1,
    }));
  }

  canMoveBack = computed(() => this.paginationResponse().pageNumber > 1);
  canMoveForward = computed(() => this.paginationResponse().pageNumber < this.paginationResponse().totalPages);
}
