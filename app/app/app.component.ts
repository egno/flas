import { Component }	from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
    selector: 'flap',
    templateUrl: 'app/app/app.component.html', 
    directives: [ ROUTER_DIRECTIVES],
})


export class AppComponent { 
	title = 'FLAP';
	apiPath = '/api/v1/';
}
