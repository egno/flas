import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute }       from '@angular/router';

import { RestService }     from '../rest/rest.service';


@Component({
  selector: 'listpage',
  templateUrl: 'app/listpage/listpage.component.html',
  providers: [RestService],
})

export class ListpageComponent implements OnInit, OnDestroy {
 
 @Input() imode:string;
 @Output() selectEvent  = new EventEmitter<string>();

	mode:string;
  modal: string;
  headers: any[];
	data: any[];
	errorMessage: any;
  selectedItem: any;
  total: number;
  start: number;
  end: number;
  page: number = 1;
  pages: number = 1;
  count: number = 10;
  navpages: number[];
  order: Array<string> = [];
  select: Array<string> = [];
  private sub: any;

	constructor(
	    private route: ActivatedRoute,
	    private router: Router,
	    private restService: RestService
	  	) {}

	ngOnInit() {
	this.sub = this.route.params.subscribe(params => {
      if (this.imode) {
        this.modal = 'modal';
        this.mode = this.imode;
      } else {
        this.modal = '';
	   	  this.mode = params['mode']; 
      }
      this.headers = [];
   		this.getHeaders(this.mode);
	 });
	}

	ngOnDestroy() {
	this.sub.unsubscribe();
	}

  onSelect(item: any) {
    this.selectedItem = item;
  }

  onSelectAndClose(item: any){
    this.selectEvent.emit(JSON.stringify(item));
  }

  onClose(item: any){
    this.selectEvent.emit(null);
  }
  
  onAdd(item: any) {
    this.router.navigate(['/l', this.mode, 0, 'new']);
  }

  onEdit(item: any) {
    this.router.navigate(['/l', this.mode, item.id, 'e']);
  }

  onView(item: any) {
    this.router.navigate(['/l', this.mode, item.id]);
  }

  onNext(page: number = 0) {
    this.page+=1;
    this.get(this.mode);
  }

  onPrev(page: number = 0) {
    this.page=1;
    this.get(this.mode);
  }

  onLast() {
    this.page=this.pages;
    this.get(this.mode);
  }

  onFirst() {
    this.page=1;
    this.get(this.mode);
  }

  onSort(header: any) {
    this.order = this.order.filter(i => i !== header.name);
    this.order.unshift(header.name);
//    console.log(this.order);
    this.get(this.mode);
  }

  getOrder(header: any) {
    let res = this.order.findIndex(i => i === header.name);
    if (res >= 0) {return res+1};
  }

  onDelete(item: any) {
    if (item.id !== undefined) {
      this.restService.delete(this.mode, item)
      .then(res => {
          this.data = this.data.filter(i => i !== item);
          if (this.selectedItem === item) { this.selectedItem = null; }
        });
    }
  }

  checkSort(header: any){
    return this.order.find(i => i === header.name);
  }

  checkSelect(){
    this.select = this.headers.map(i => {return <string>
      (i.references) ? `${i.name}{id,d}` : i.name;
    });
    console.log(this.select);
  }

  get(path: string) {
      let restParams: any = {};
      this.page = (this.page <1)? 1 : this.page;
      this.page = (this.page > this.pages)? this.pages : this.page;
      restParams.page = this.page;
      restParams.count = this.count;
      restParams.order = this.order.toString();
      restParams.select = this.select.toString();
       this.restService.get(path, restParams)
          .then(
            d => {
                this.data = d.data; 
                this.total=d.total; 
                this.start=d.start; 
                this.end=d.end; 
                this.pages= ~~((this.total-1) / this.count) + 1;
                console.log(this.data);
                }           
            )
          .catch(message => {this.errorMessage = message; this.page=1; this.pages=1});
      ;
    } 

  getHeaders(path: string) {
      this.restService.getHeaders(path)
          .then(
            d => {this.headers = d.data.columns;
              this.checkSelect();
              this.get(this.mode);
              }           
            )
          .catch(message => {this.errorMessage = message});
      ;
    }   
}
