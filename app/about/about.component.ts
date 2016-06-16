import { Component, OnInit } from '@angular/core';
import 'rxjs/Rx';

import { ConfigService }     from '../config/config.service';
import { RestService }     from '../rest/rest.service';


@Component({
  selector: 'about',
  templateUrl: 'app/about/about.component.html',
  providers: [ConfigService, RestService],
})

export class AboutComponent implements OnInit {
  config: any = {};
  errorMessage: string;
  settings: Array<any> = [];
    constructor(
        private configService: ConfigService,
        private restService: RestService 
      ) { } 

    ngOnInit() {
      this.getConfig();
      this.getRest('settings');
    }

    getConfig() {
      this.configService.getConfig()
          .subscribe(
            data => {this.config = data},            
            error => {this.errorMessage = <any>error}
            );
    }

    getRest(path: string) {
      this.restService.getRest(path)
          .subscribe(
            data => {this.settings = data},            
            error => {this.errorMessage = <any>error}
            );
    }

}
