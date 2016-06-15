import { Component } from '@angular/core';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router-deprecated';

import { AboutComponent }     from './about/about.component';


@Component({
    selector: 'flap',
    template: `<h1>{{title}}</h1>
        <router-outlet></router-outlet>
    `,
    directives: [
    	ROUTER_DIRECTIVES
    ],
  	providers: [
	    ROUTER_PROVIDERS,
    ],
})

@RouteConfig([
  { path: '/about',  name: 'About',  component: AboutComponent, useAsDefault: true },
])

export class AppComponent { 
	title = 'FLAP';
    
}
