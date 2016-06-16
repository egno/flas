import { Component, OnInit } from '@angular/core';
import {Http, Response, HTTP_PROVIDERS} from '@angular/http';
import 'rxjs/Rx';
import { Observable }     from 'rxjs/Observable';
import { ConfigService }     from '../config/config.service';


@Component({
  selector: 'about',
  templateUrl: 'app/about/about.component.html',
  providers: [HTTP_PROVIDERS, ConfigService],
})

export class AboutComponent implements OnInit {
  config: any = {};
	version: string = '0';
  errorMessage: string;
    constructor(private http: Http,
      private configService: ConfigService 
      ) { } 

    ngOnInit() {
      this.getConfig();
    }

    getVersion() {
        this.http.get('../../package.json')
            .map(res => res.json())
            .subscribe((data) => {this.version=data.version},
            err=>console.log(err),
            ()=>console.log('version: ', this.version));
    }

    getConfig() {
      this.configService.getConfig()
          .subscribe(
            data => {this.config = data; console.log(data); console.log(this.config.version)},            
            error => {this.errorMessage = <any>error; console.log(error)}
            );
    }
}
