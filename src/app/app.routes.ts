import { Routes } from "@angular/router";
import { moderatorGuard } from "@guards/moderator-guard";
import { organizerGuard } from "@guards/organizer-guard";
import { DashboardNews } from "@routed-components/dashboard-news/dashboard-news";

export const routes: Routes = [
  {
    path: "dashboard/news",
    component: DashboardNews,
  },
  {
    path: "posts",
    loadComponent: () => import("@routed-components/posts/posts").then((m) => m.Posts),
    canActivate: [organizerGuard],
  },
  {
    path: "approvals",
    loadComponent: () => import("@routed-components/approvals/approvals").then((m) => m.Approvals),
    canActivate: [moderatorGuard],
  },
  { path: "**", redirectTo: "/dashboard/news" },
];
