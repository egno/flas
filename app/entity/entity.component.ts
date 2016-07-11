import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute }       from '@angular/router';
import { NgForm }    from '@angular/common';

import { RestService }     from '../rest/rest.service';
import { SelectListComponent }  from '../select_list/select_list.component';

import { ListpageComponent }  from '../listpage/listpage.component';


@Component({
  selector: 'entity',
  templateUrl: 'app/entity/entity.component.html',
  providers: [RestService],
  directives: [ListpageComponent]
})

export class EntityComponent implements OnInit, OnDestroy {
	mode: string;
	headers: any[];
  id: string;
	item: any = {};
	errorMessage: any;
  editMode: any;
  select: Array<string> = [];
  foreigners: any = {};
  selectIsVisible: boolean = false;
    private sub: any;

	constructor(
	    private route: ActivatedRoute,
	    private router: Router,
	    private restService: RestService
	  	) {}

	ngOnInit() {
	this.sub = this.route.params.subscribe(params => {
	   	this.mode = params['mode']; 
      this.id = params['id']; 
      this.editMode = params['edit']; 
//	   	console.log(this.mode, this.id, this.editMode);
   		this.getHeaders(this.mode);
	 });
	}

	ngOnDestroy() {
	this.sub.unsubscribe();
	}

  onGo(mode: string) {
    this.router.navigate(['/l', mode]);
  }

  onSelectValue(name: string, event:string){
    console.log(event);
    if (event) {
      this.item[name] = JSON.parse(event);
    };
    this.selectIsVisible = '';
  }

  openSelect(){
    this.selectIsVisible = 'visible';
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
      (h.references) ? `${h.name}{uuid,d}` : h.name;
    });
//    console.log(this.select);
  }

  getForeigners(){
    let restParams: any = {};
    restParams.select = 'uuid,d';
    restParams.order = 'd,uuid';
    this.headers.map(h => {
      if (h.references) {
 //       console.log('getForeigners: ', h.references.table, h.name, this.item);
         this.restService.get(h.references.table, restParams)
           .then(d=>{
               let f: any = {};
               f.list=d.data;
               f.total=d.total;
               this.foreigners[h.name]=f;
               console.log(this.foreigners);
             })
           .catch(message => {this.errorMessage = message; console.log(this.errorMessage)})
      }
    });
  } 

    get(path: string, id: string) {
      let restParams: any = {};
      restParams.id = id;
      restParams.select = this.select.toString();
      return this.restService.get(path, restParams)
          .then(
            d => {this.item = d.data[0];
                this.getForeigners();//; console.log(this.item)
              }           
            )
          .catch(message => {this.errorMessage = message});
     } 

    getHeaders(path: string) {
      this.restService.getHeaders(path)
          .then(
            d => {this.headers = d.data.columns; 
                console.log(this.headers);
                   if (this.editMode !== 'new') {
                     this.headers = d.data.columns;
                     this.checkSelect();
                     this.get(this.mode, this.id);
                   }
              }           
            )
          .catch(message => {this.errorMessage = message});
      ;
    }  

  onEdit(item: any) {
    this.router.navigate(['/l', this.mode, item.uuid, 'e']);
  }

  onDelete(item: any) {
    if (item.uuid !== undefined) {
      this.restService.delete(this.mode, item)
      .then(res => {this.router.navigate(['/l', this.mode])})
    }
  }

  onSave(item: any) {
    this.headers.map(h => {
      if (h.references && item[h.name] !== null) {
         item[h.name]=item[h.name].uuid
      }
    });
    if (item.uuid !== undefined) {
      this.restService.patch(this.mode, this.item)
        .then(res => {this.router.navigate(['/l', this.mode, item.uuid])});
    } else {
      this.restService.post(this.mode, this.item)
        .then(id => {this.router.navigate(['/l', this.mode, id])});
    }
  }

}
