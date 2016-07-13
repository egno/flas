import { Component, OnInit } from '@angular/core';

import { RestService }     from '../rest/rest.service';

import appGlobals = require('../globals');

@Component({
  selector: 'my-test',
  templateUrl: 'app/test/test.component.html',
  providers: [RestService],
})

export class TestComponent implements OnInit {
  config: any = appGlobals;
  settings: Array<any> = [{}];
  errorMessage: any;

  constructor(private restService: RestService) { }

    ngOnInit() {
    	this.get('settings');
    }

    onSave(name: string){
      appGlobals.api=this.config.api;
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
