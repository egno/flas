import { Component }	from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import {AppNav} from '../navigation/navigation.component';

@Component({
    selector: 'flap',
    templateUrl: 'app/app/app.component.html', 
    directives: [ROUTER_DIRECTIVES, AppNav],
})


export class AppComponent { 
	title = 'FLAP';
	apiPath = '/api/v1/';
}
