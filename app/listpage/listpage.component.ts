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
  selectedItem: any;

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

  onSelect(item: any) {
    this.selectedItem = item;
  }
  
  onAdd(item: any) {
    this.router.navigate(['/l', this.mode, 0, 'new']);
  }

  onEdit(item: any) {
    this.router.navigate(['/l', this.mode, item.uuid, 'e']);
  }

  onView(item: any) {
    this.router.navigate(['/l', this.mode, item.uuid]);
  }

  onDelete(item: any) {
    if (item.uuid !== undefined) {
      this.restService.delete(this.mode, item)
      .then(res => {
          this.data = this.data.filter(i => i !== item);
          if (this.selectedItem === item) { this.selectedItem = null; }
        });
    }
  }

  getRest(path: string) {
      this.restService.getRest(path)
          .then(
            d => {this.data = d}           
            )
          .catch(message => {this.errorMessage = message});
      ;
    } 

  getRestHeaders(path: string) {
      this.restService.getRestHeaders(path)
          .then(
            d => {this.headers = d.columns}           
            )
          .catch(message => {this.errorMessage = message});
      ;
    }    
}
