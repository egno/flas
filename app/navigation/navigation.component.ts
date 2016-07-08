import { Component }  from '@angular/core';
import {
  ROUTER_DIRECTIVES,
} from '@angular/router';

import {TestComponent} from '../test/test.component';


@Component({
  selector: 'app-nav',
  directives: [ROUTER_DIRECTIVES],
  template: `
    <nav>
      <a *ngFor="let route of routes"
        [routerLink]="route.path">
        {{route.name}}
      </a>
    </nav>
  `
})

export class AppNav {
  routes: string[];
}
