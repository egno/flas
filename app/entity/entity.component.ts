import { Component, Input, OnInit, AfterContentInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute }       from '@angular/router';
import { NgForm }    from '@angular/common';

import { RestService }     from '../rest/rest.service';
import { TranslateService }  from '../translate/translate.service';
import { SelectListComponent }  from '../select_list/select_list.component';

import { ListpageComponent }  from '../listpage/listpage.component';


@Component({
  selector: 'entity',
  templateUrl: 'app/entity/entity.component.html',
  providers: [RestService, TranslateService],
  directives: [ListpageComponent]
})

export class EntityComponent implements OnInit, AfterContentInit, OnDestroy {
	mode: string;
  dmode: string;
	headers: any[];
  dheaders: any [];
  id: string;
	item: any = {};
	errorMessage: any;
  editMode: any;
  select: Array<string> = [];
  foreigners: any = {};
  selectIsVisible: boolean = false;
  refmode: string;
  refname: string;
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
	   	this.mode = params['mode']; 
      this.id = params['id']; 
      this.editMode = params['edit']; 
//	   	console.log(this.mode, this.id, this.editMode);
   		this.getHeaders(this.mode);
      this.dmode = this.translateService.get(this.mode);
	 });
    this.labels.Edit='Edit';
    this.labels.Del='Del';
    this.labels.View='View';
    this.labels.Add='Add';
    this.labels.Save='Save';
	}

  ngAfterContentInit(){
    console.log('ngAfterContentInit');
      for (let e in this.labels) {
        this.labels[e]=this.translateService.get(e, false, true);
      }
    console.log(this.labels.edit);
  }

	ngOnDestroy() {
	this.sub.unsubscribe();
	}

  onGo(mode: string) {
    this.router.navigate(['/l', mode]);
  }

  onSelectValue(name: string, event:string){
    if (event) {
      this.item[name] = JSON.parse(event);
    };
    this.refmode = '';
    this.refname = '';
    this.selectIsVisible = false;
  }

  openSelect(h: any){
    this.refmode = h.references.table;
    this.refname = h.name;
    this.selectIsVisible = true;
  }

  parseEvent(event: string){
    return event === null ? null : JSON.parse(event);
  }

  getType(header: any) {
    let res: string = 'text';
//    console.log(header.type);
    if (header.type === 'date') {res = 'date'}; 
    if (header.type === 'numeric' || header.type === 'int') {res = 'number'}; 
    return res;
  }

  checkSelect(){
    this.select = this.headers.map(h => {return <string>
      (h.references) ? `${h.name}{id,d}` : h.name;
    });
//    console.log(this.select);
  }

  translateHeaders(){
    this.headers = this.headers.map(
        h => {h.d = this.translateService.get(h.name, false, true); return h;}
      )
  }

  getDisplayHeaders(){
    this.dheaders = this.headers.filter(
      h => (h.name !== 'id' && h.name !== 'ts') 
      );
  }

  getForeigners(){
    let restParams: any = {};
    let enumTableName: string = 'enums';
    restParams.select = 'id,d';
    restParams.order = 'code,d';
    restParams.where = '';
    this.headers.map(h => {
      if (h.references && h.references.table === enumTableName) {
 //       console.log('getForeigners: ', h.references.table, h.name, this.item);
         restParams.where = 'grp=<@.'+this.mode+'.'+h.name;
         console.log(restParams);
         this.restService.get(h.references.table, restParams)
           .then((d:any) => {
               let f: any = {};
               f.list=d.data;
               f.total=d.total;
               this.foreigners[h.name]=f;
               //console.log(this.foreigners);
             })
           .catch((message:string) => {this.errorMessage = message; console.log(this.errorMessage)})
        if (!this.item[h.name]) {
          let v: any = {};
          v.d = '';
          v.id = null;
          this.item[h.name] = v;
        }
      }
    });
    //console.log(this.item);
  } 


    get(path: string, id: string) {
      let restParams: any = {};
      restParams.id = id;
      restParams.select = this.select.toString();
      return this.restService.get(path, restParams)
          .then(
            (d:any) => {this.item = d.data[0];
                //; console.log(this.item)
              }           
            )
          .catch((message:string) => {this.errorMessage = message});
     } 

    getHeaders(path: string) {
      this.restService.getHeaders(path)
          .then(
            d => {this.headers = d.data.columns; 
                console.log(this.headers);
                   this.checkSelect();
                   if (this.editMode !== 'new') {
                     this.get(this.mode, this.id);
                   };
                   this.getForeigners();
                   this.translateHeaders();
                   this.getDisplayHeaders();
              }           
            )
          .catch((message:string) => {this.errorMessage = message});
      ;
    }  

  onEdit(item: any) {
    this.router.navigate(['/l', this.mode, item.id, 'e']);
  }

  onDelete(item: any) {
    if (item.id !== undefined) {
      this.restService.delete(this.mode, item)
      .then((res:any) => {this.router.navigate(['/l', this.mode])})
    }
  }

  onSave(item: any) {
    this.headers.map(h => {
      if (h.references && item[h.name] && item[h.name] !== null) {
         item[h.name]=item[h.name].id
      }
    });
    if (item.id !== undefined) {
      this.restService.patch(this.mode, this.item)
        .then((res:any) => {this.router.navigate(['/l', this.mode, item.id])});
    } else {
      this.restService.post(this.mode, this.item)
        .then((id:string) => {this.router.navigate(['/l', this.mode, id])});
    }
  }

}
