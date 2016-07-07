import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute }       from '@angular/router';

import { RestService }     from '../rest/rest.service';


@Component({
  selector: 'listpage',
  templateUrl: 'app/listpage/listpage.component.html',
  providers: [RestService],
})

export class ListpageComponent implements OnInit, OnDestroy {
	mode: string;
	headers: any[];
	data: any[];
  	private sub: any;
	errorMessage: any;

	constructor(
	    private route: ActivatedRoute,
	    private router: Router,
	    private restService: RestService
	  	) {}

	ngOnInit() {
	this.sub = this.route.params.subscribe(params => {
	   	this.mode = params['mode']; 
	   	console.log(this.mode);
   		this.getRestHeaders(this.mode);
   		this.getRest(this.mode);
	 });
	}

	ngOnDestroy() {
	this.sub.unsubscribe();
	}

    getRest(path: string) {
      this.restService.getRest(path)
          .then(
            d => {this.data = d; console.log(this.data)}           
            )
          .catch(message => {this.errorMessage = message});
      ;
    } 

    getRestHeaders(path: string) {
      this.restService.getRestHeaders(path)
          .then(
            d => {this.headers = d.columns; console.log(this.headers)}           
            )
          .catch(message => {this.errorMessage = message});
      ;
    }    

  }
}
