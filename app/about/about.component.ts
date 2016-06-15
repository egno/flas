import { Component, OnInit } from '@angular/core';
import {Http, Response, HTTP_PROVIDERS} from '@angular/http';
import 'rxjs/Rx';
import { Observable }     from 'rxjs/Observable';


@Component({
  selector: 'about',
  templateUrl: 'app/about/about.component.html',
  providers: [HTTP_PROVIDERS],
})

export class AboutComponent implements OnInit {
	version: string;
    constructor(private http: Http) { } 

    ngOnInit() {
        this.http.get('../../package.json')
            .map(res => res.json())
            .subscribe((data) => {this.version=data.version},
            err=>console.log(err),
            ()=>console.log('version: ', this.version));
    }

    getVersion() {
    	return this.version;
    }
}
