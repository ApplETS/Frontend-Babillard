import { Component, computed, input } from "@angular/core";
import { TranslocoDirective } from "@jsverse/transloco";
import { TranslocoDatePipe } from "@jsverse/transloco-locale";
import { Constants } from "@models/constants";
import { Event } from "@models/event";

@Component({
  selector: "app-approval-table",
  imports: [TranslocoDirective, TranslocoDatePipe],
  templateUrl: "./approval-table.html",
})
export class ApprovalTable {
  events = input.required<Event[]>();
  readonly newsStatuses = Constants.newsStatuses;

    headers = computed<{ key: string; label: string }[]>(() => {
    return [
      { key: "author", label: "approval.table.author" },
      { key: "title", label: "approval.table.title" },
      { key: "publicationDate", label: "approval.table.release-date" },
      { key: "state", label: "approval.table.status" },
      { key: "actions", label: "" },
    ];
  });

}
