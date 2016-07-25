import { Component, Input, Output, EventEmitter, 
  OnInit, AfterContentInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute }       from '@angular/router';

import { RestService }     from '../rest/rest.service';
import { TranslateService }  from '../translate/translate.service';


@Component({
  selector: 'listpage',
  templateUrl: 'app/listpage/listpage.component.html',
  providers: [RestService, TranslateService],
})

export class ListpageComponent implements OnInit, AfterContentInit, OnDestroy {
 
 @Input() imode:string;
 @Output() selectEvent  = new EventEmitter<string>();

	mode:string;
  dmode: string;
  modal: string;
  headers: any[];
  dheaders: any[];
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
  labels: any = {};

	constructor(
	    private route: ActivatedRoute,
	    private router: Router,
	    private restService: RestService,
      private translateService: TranslateService
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
      this.dmode = this.translateService.get(this.mode,true,true);
   });
    this.labels.Select='Select';
    this.labels.Cancel='Cancel';
    this.labels.Edit='Edit';
    this.labels.Del='Del';
    this.labels.View='View';
    this.labels.Add='Add';
	}

  ngAfterContentInit(){
      for (let e in this.labels) {
        this.labels[e]=this.translateService.get(e,false,true);
      }
    this.dmode = this.translateService.firstLetterToUpper(
      this.translateService.get(this.mode,true,true)
      );
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

  onRefresh() {
    this.get(this.mode);
  }


  translateHeaders(){
    this.headers = this.headers.map(
        h => {h.d = this.translateService.firstLetterToUpper(this.translateService.get(h.name)); return h;}
      )
  }

  getDisplayHeaders(){
    this.dheaders = this.headers.filter(
      h => (h.name !== 'id' && h.name !== 'ts' && h.type !== 'json' && h.type !== 'jsonb') 
      );
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
  }

  get(path: string) {
      let filter: string;
      let restParams: any = {};
      this.selectedItem='';
      this.page = (this.page <1)? 1 : this.page;
      this.page = (this.page > this.pages)? this.pages : this.page;
      restParams.page = this.page;
      restParams.count = this.count;
      restParams.order = this.order.toString();
      restParams.select = this.select.toString();
      for (var h of this.headers) {
        switch (h.type) {
          case 'numeric':
          case 'date':
            filter = `${h.name}=eq.${h.filter}`
            break;
          default: 
            filter = `${h.name}=ilike.${h.filter}*`
        }
        
        if (h.filter && h.filter !== '') {
          //h.filter=h.filter.replace(' ','*')
          if (!restParams.where) {
            restParams.where = restParams.where + '&'+ filter;
          } else {
            restParams.where = filter
          }
        }
      };
       this.restService.get(path, restParams)
          .then(
            d => {
                this.data = d.data; 
                this.total=d.total; 
                this.start=d.start; 
                this.end=d.end; 
                this.pages= ~~((this.total-1) / this.count) + 1;
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
              this.translateHeaders();
              this.getDisplayHeaders();
              }           
            )
          .catch(message => {this.errorMessage = message});
      ;
    }   
}
