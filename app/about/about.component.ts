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
  config: any;
	version: string;
  errorMessage: string;
    constructor(private http: Http
      //private configService: ConfigService 
      ) { } 

    ngOnInit() {
        this.http.get('../../package.json')
            .map(res => res.json())
            .subscribe((data) => {this.version=data.version},
            err=>console.log(err),
            ()=>console.log('version: ', this.version));
        
       // this.config = this.configService
        //  .getConfig()
        //  .subscribe(
        //    data => {console.log(data)},            error => this.errorMessage = <any>error
        //    );
  
    }

    getVersion() {
    	return this.version;
    }
}
