import { Component } from '@angular/core';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router-deprecated';

import { AboutComponent }     from './about/about.component';
import { NavigationComponent }     from './navigation/navigation.component';


@Component({
    selector: 'flap',
    templateUrl: 'app/app.component.html', 
    directives: [
    	ROUTER_DIRECTIVES,
        NavigationComponent
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
