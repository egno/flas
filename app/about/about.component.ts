import { Component, OnInit } from '@angular/core';
import 'rxjs/Rx';

import { ConfigService }     from '../config/config.service';


@Component({
  selector: 'about',
  templateUrl: 'app/about/about.component.html',
  providers: [ConfigService],
})

export class AboutComponent implements OnInit {
  config: any = {};
  errorMessage: string;
    constructor(
        private configService: ConfigService 
      ) { } 

    ngOnInit() {
      this.getConfig();
    }

    getConfig() {
      this.configService.getConfig()
          .subscribe(
            data => {this.config = data},            
            error => {this.errorMessage = <any>error; console.log(error)}
            );
    }
}
