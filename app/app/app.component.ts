import { Component }	from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import {AppNav} from '../navigation/navigation.component';


@Component({
    selector: 'flap',
    templateUrl: 'app/app/app.component.html', 
    directives: [AppNav, ROUTER_DIRECTIVES],
})


export class AppComponent { 
	title = 'FLAP';
}
