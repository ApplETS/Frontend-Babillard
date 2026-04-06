import { Component } from '@angular/core';
import { Calendar } from "../../components/calendar/calendar";
import { Publications } from "../../components/publications/publications";
import { LoadingSpinner } from "../../components/loading-spinner/loading-spinner";
import { Dashboard } from "../../components/dashboard/dashboard";

@Component({
  selector: 'app-dashboard-news',
  imports: [Calendar, Publications, LoadingSpinner, Dashboard],
  templateUrl: './dashboard-news.html',
})
export class DashboardNews {}
