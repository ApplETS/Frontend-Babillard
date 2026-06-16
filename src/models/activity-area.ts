export interface ActivityArea {
  id: string;
	nameFr: string;
	nameEn: string;

}
export function getActivityAreaName(actvityArea: ActivityArea | null | undefined, locale: string): string {
  return (locale === "fr" ? actvityArea?.nameFr : actvityArea?.nameEn) ?? "";
}