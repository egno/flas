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
  total: number;
  start: number;
  end: number;
  page: number;
  pages: number;

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

  onNext(page: number = 0) {
    this.getRest(this.mode);
  }

  onPrev(page: number = 0) {
    this.getRest(this.mode);
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
            d => {
                this.data = d.data; 
                this.total=d.total; 
                this.start=d.start; 
                this.end=d.end; 
                this.pages= ~~(this.total/ 10) + 1;
                this.page= ~~(this.start/ 10) + 1;
                console.log(this.data)}           
            )
          .catch(message => {this.errorMessage = message});
      ;
    } 

  getRestHeaders(path: string) {
      this.restService.getRestHeaders(path)
          .then(
            d => {this.headers = d.data.columns; console.log(this.headers)}           
            )
          .catch(message => {this.errorMessage = message});
      ;
    }    
}
