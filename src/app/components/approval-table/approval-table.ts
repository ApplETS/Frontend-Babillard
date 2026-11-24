import { Component, computed, inject, input } from "@angular/core";
import { Avatar } from "@components/avatar/avatar";
import { TranslocoDirective, TranslocoService } from "@jsverse/transloco";
import { TranslocoDatePipe } from "@jsverse/transloco-locale";
import { ActivityArea } from "@models/activity-area";
import { Constants } from "@models/constants";
import { Event } from "@models/event";

@Component({
  selector: "app-approval-table",
  imports: [TranslocoDirective, TranslocoDatePipe, Avatar],
  templateUrl: "./approval-table.html",
})
export class ApprovalTable {
  events = input.required<Event[]>();
  readonly newsStatuses = Constants.newsStatuses;

  translocoService = inject(TranslocoService);

    headers = computed<{ key: string; label: string }[]>(() => {
    return [
      { key: "author", label: "approval.table.author" },
      { key: "title", label: "approval.table.title" },
      { key: "publicationDate", label: "approval.table.release-date" },
      { key: "state", label: "approval.table.status" },
      { key: "actions", label: "" },
    ];
  });

  activityAreaName(activityArea: ActivityArea): string {
    return this.translocoService.activeLang() === "fr" ? activityArea.nameFr : activityArea.nameEn;
  }

}
