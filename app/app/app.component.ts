import { Component }	from '@angular/core';
import { ROUTER_DIRECTIVES }  from '@angular/router';

import {routes} from '../app/app.routes';

@Component({
    selector: 'flap',
    templateUrl: 'app/app/app.component.html', 
    directives: [ROUTER_DIRECTIVES],
})

export class AppComponent { 
	title = 'FLAP';
	lroutes=routes;
}