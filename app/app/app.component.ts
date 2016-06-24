import { Component }	from '@angular/core';

import { TestComponent }	from '../test/test.component';

@Component({
    selector: 'flap',
    templateUrl: 'app/app/app.component.html', 
    directives: [TestComponent],
})

export class AppComponent { 
	title = 'FLAP';    
}