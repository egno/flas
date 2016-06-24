import { Component }	from '@angular/core';
import { ROUTER_DIRECTIVES }  from '@angular/router';

import { TestComponent }	from '../test/test.component';
import { Test1Component }	from '../test1/test1.component';

import {routes} from '../app/app.routes';

@Component({
    selector: 'flap',
    templateUrl: 'app/app/app.component.html', 
    directives: [ROUTER_DIRECTIVES, TestComponent],
})

export class AppComponent { 
	title = 'FLAP';
	lroutes=routes;
}