import { provideRouter, RouterConfig }  from '@angular/router';

import { TestComponent }  from '../test/test.component';
import { ListpageComponent }  from '../listpage/listpage.component';
import { EntityComponent }  from '../entity/entity.component';

export const routes: RouterConfig = [
  { path: '', redirectTo: 'about' },
  { path: 'about', component: TestComponent },
  { path: 'l', component: ListpageComponent},
  { path: 'l/:mode', component: ListpageComponent},
  { path: 'l/:mode/:id', component: EntityComponent},
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes),
];