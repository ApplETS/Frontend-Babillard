import { Routes } from '@angular/router';
import { App } from './app';

export const routes: Routes = [
  { path: 'api/auth/callback/authentik', component: App },
  { path: 'unauthorized', component: App },
  { path: '', component: App }
];
