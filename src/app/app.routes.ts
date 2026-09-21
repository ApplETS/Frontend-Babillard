import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: "dashboard/news", loadComponent: () => import('@routed-components/dashboard-news/dashboard-news').then(m => m.DashboardNews) },
  { path: "posts", loadComponent: () => import('@routed-components/posts/posts').then(m => m.Posts) },
  { path: '**', redirectTo: '/dashboard/news' }
];
