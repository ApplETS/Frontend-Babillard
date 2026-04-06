import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: "dashboard/news", loadComponent: () => import('@routed-components/dashboard-news/dashboard-news').then(m => m.DashboardNews) },
];
