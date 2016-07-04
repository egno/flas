import { provideRouter, RouterConfig }  from '@angular/router';

import { TestComponent }  from '../test/test.component';
import { Test1Component }  from '../test1/test1.component';

export const routes: RouterConfig = [
  { path: '', redirectTo: 'test1' },
  { path: 'test', component: TestComponent },
  { path: 'test1', component: Test1Component},
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes),
];