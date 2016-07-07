import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute }       from '@angular/router';

import { RestService }     from '../rest/rest.service';


@Component({
  selector: 'entity',
  templateUrl: 'app/entity/entity.component.html',
  providers: [RestService],
})

export class EntityComponent implements OnInit, OnDestroy {
	mode: string;
	headers: any[];
  id: string;
	item: any;
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
      this.id = params['id']; 
	   	console.log(this.mode, this.id);
   		this.getRestHeaders(this.mode);
   		this.getRest(this.mode, this.id);
	 });
	}

	ngOnDestroy() {
	this.sub.unsubscribe();
	}

    getRest(path: string, id: string) {
      this.restService.getRest(path, id)
          .then(
            d => {this.item = d[0]; console.log(this.item)}           
            )
          .catch(message => {this.errorMessage = message});
      
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
