import { Signal } from "@angular/core";

export interface RouteInfo {
  route: string;
  label: string;
  activeRoute: Signal<boolean>;
}
