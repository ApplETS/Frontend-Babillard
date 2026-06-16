export class ActivityArea {
  id!: string;
	nameFr!: string;
	nameEn!: string;

  activityAreaName(locale: string): string {
    return locale === "fr" ? this.nameFr : this.nameEn;
  }
}