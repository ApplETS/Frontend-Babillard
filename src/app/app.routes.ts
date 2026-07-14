import { Routes } from '@angular/router';
import { App } from './app';
import { Home } from './components/home/home';

export const routes: Routes = [
  { path: 'signin-oidc', component: Home },
  { path: '', component: Home },
  { path: '**', redirectTo: '' }
];
