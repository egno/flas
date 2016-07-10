import { Component, OnInit } from '@angular/core';

import { RestService }     from '../rest/rest.service';


@Component({
  selector: 'my-test',
  templateUrl: 'app/test/test.component.html',
  providers: [RestService],
})

export class TestComponent implements OnInit {
  config: any = {};
  settings: Array<any> = [];
  errorMessage: any ;

  constructor(private restService: RestService) { }

    ngOnInit() {
    	this.config.version='0.0.2';
    	this.get('settings');
    }
    get(path: string) {
      this.restService.get(path)
          .then(
            d => {this.settings = d.data}           
            )
          .catch(message => {this.errorMessage = message});
    }    
}
