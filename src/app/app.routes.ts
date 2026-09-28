import { Routes } from '@angular/router';
import { organizerGuard } from '@guards/organizer-guard';

export const routes: Routes = [
  { path: "dashboard/news", loadComponent: () => import('@routed-components/dashboard-news/dashboard-news').then(m => m.DashboardNews) },
  { path: "posts", loadComponent: () => import('@routed-components/posts/posts').then(m => m.Posts), canActivate: [organizerGuard] },
  { path: '**', redirectTo: '/dashboard/news' }
];
