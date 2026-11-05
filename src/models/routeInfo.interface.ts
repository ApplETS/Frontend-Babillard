import { Signal } from "@angular/core";
import { IconDefinition } from "@fortawesome/angular-fontawesome";

export interface RouteInfo {
  route: string;
  label: string;
  activeRoute: Signal<boolean>;
  icon: IconDefinition;
}
