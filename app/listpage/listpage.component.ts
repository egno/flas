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
  order: any[] = [{}];
  select: Array<string> = [];
  private sub: any;
  labels: any = {};
  actionsPath: string = 'menu';
  actions: any[];

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
      this.order = [{}];
      this.headers = [];
   		this.getHeaders(this.mode);
      this.dmode = this.translateService.get(this.mode,true,true);
      this.getActions();
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

  onSort(header: any, event:any) {
    let v: any = {};
    v.name = header.name;
    v.desc = this.order.reduce((r, i) => r || (i.name===v.name && !i.desc), false);
    if (!event.ctrlKey) {
      this.order = [{}];
    }
    this.order = this.order.filter(i => (i.name && i.name !== header.name));
    this.order.push(v);
//    console.log(this.order);
    this.get(this.mode);
  }

  onRefresh() {
    this.get(this.mode);
  }

  onAction(action: any){
    let restParams: any = {};
    restParams.cond='*';
    this.actions = this.actions.map(a => {(a === action) ? a.progress = 1: a.progress = a.progress; return a});
    this.restService.post('rpc/'+action.proc, restParams)
      .then( d => 
          this.actions = this.actions.map(a => {(a === action) ? a.progress = 0: a.progress = a.progress; return a})
        );
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
    let o: any = {};
    let res: number = this.order.findIndex(i => i.name === header.name);
    if (res >= 0) {
    	o.seq = res+1;
	o.order = (this.order[res].desc) ? 'desc' : 'asc';
	o.sign = (this.order[res].desc) ? '▲':'▼';
	o.count = this.order.length;
    };
    return o;
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
      restParams.order = this.order.filter(i => i.name).map(i => `${i.name}` + ((i.desc) ? '.desc' : '')).join(',');
      restParams.select = this.select.toString();
      for (var h of this.headers) {
        switch (h.type) {
          case 'numeric':
          case 'date':
            filter = `${h.name}=eq.${h.filter}`
            break;
          default: 
            filter = `${h.name}=ilike.*${h.filter}*`
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

  getActions() {
      let restParams: any = {};
      restParams.where = 'path=eq.'+`${this.mode}`
      this.actions = [{}];
      this.restService.get(this.actionsPath, restParams)
          .then(
            d => {
              this.actions = d.data[0].actions.map((a:any) => {a.name = this.translateService.get(a.name,false,true); return a});
              }           
            )
          .catch(message => {this.errorMessage = message});
      ;
    }   

}
