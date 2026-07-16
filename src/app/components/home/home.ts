import { Component, inject, signal } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { NavBar } from '../nav-bar/nav-bar';

@Component({
  selector: 'app-home',
  imports: [TranslocoPipe, NavBar],
  templateUrl: './home.html',
})

export class Home {
}
