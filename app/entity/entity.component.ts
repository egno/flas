/**
 * @license
 * Copyright Alexander Shelemetyev (Александр Шелеметьев) aka Egno.
 * https://github.com/egno/flas
 *
 ***** EN *****
 * This file is part of FLAP.
 *
 * FLAP is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3, or
 * (at your option) any later version.
 *
 * FLAP is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with FLAP.  If not, see <http://www.gnu.org/licenses/>.
 *
 * Use of this source code is governed by an GNU GPLv3 license that can be
 * found in the LICENSE file at https://github.com/egno/flas/blob/master/LICENSE
 *
 ***** RU *****
 *  Этот файл — часть FLAP.
 *
 *  FLAP - свободная программа: вы можете перераспространять ее и/или
 *  изменять ее на условиях Стандартной общественной лицензии GNU версии 3,
 *  либо (по вашему выбору) любой более поздней версии этой лицензии.
 *
 *  FLAP распространяется в надежде, что она будет полезной,
 *  но БЕЗО ВСЯКИХ ГАРАНТИЙ; даже без неявной гарантии ТОВАРНОГО ВИДА
 *  или ПРИГОДНОСТИ ДЛЯ ОПРЕДЕЛЕННЫХ ЦЕЛЕЙ. Подробнее см. в Стандартной
 *  общественной лицензии GNU.
 *
 *  Вы должны были получить копию Стандартной общественной лицензии GNU
 *  вместе с этой программой. Если это не так, см.
 *  <http://www.gnu.org/licenses/>.
 */
import { Component, Input, OnInit, AfterContentInit, OnDestroy } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute }       from '@angular/router';
import { NgForm }    from '@angular/common';

import { RestService }     from '../rest/rest.service';
import { TranslateService }  from '../translate/translate.service';
import { SelectListComponent }  from '../select_list/select_list.component';

import { ListpageComponent }  from '../listpage/listpage.component';
import {JsonViewComponent} from '../json_view/json_view.component';


@Component({
  selector: 'entity',
  templateUrl: 'app/entity/entity.component.html',
  directives: [ListpageComponent, JsonViewComponent]
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
  actionsPath: string = 'menu';
  actions: any[];
  dependencies: any[];
  dependenciesTable: string = 'constraint_relations';


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
      this.getDependencies();
      this.getActions();
      this.dmode = this.translateService.get(this.mode,false,true);
	 });
    this.labels.Edit='Edit';
    this.labels.Del='Del';
    this.labels.View='View';
    this.labels.Add='Add';
    this.labels.Save='Save';
    this.labels.Cancel='Cancel';
    delete this.dependencies;
	}

  ngAfterContentInit(){
//    console.log('ngAfterContentInit');
      for (let e in this.labels) {
        this.labels[e]=this.translateService.get(e, false, true);
      }
//    console.log(this.labels.edit);
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

  onDetail(h: any, id: string){
    this.router.navigate(['/l', h.references.table, id]);
  }

  onEdit(item: any) {
    this.router.navigate(['/l', this.mode, item.id, {'edit':'e'}]);
  }

  onDelete(item: any) {
    if (item.id !== undefined) {
      this.restService.delete(this.mode, item)
      .then((res:any) => {this.router.navigate(['/l', this.mode])})
    }
  }

  onCancel(item: string) {
    this.router.navigate(['/l', this.mode]);
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


  openSelect(h: any){
    this.refmode = h.references.table;
    this.refname = h.name;
    this.selectIsVisible = true;
  }

  onShowDependency(dependency: any){
    this.router.navigate(['/l', dependency.path]);
  }

  onAction(action: any){
    let restParams: any = {};
    restParams.cond=this.item.id;
    this.actions = this.actions.map(a => {(a === action) ? a.progress = 1: a.progress = a.progress; return a});
    this.restService.post('rpc/'+action.proc, restParams)
      .then( d => {
          this.actions = this.actions.map(a => {(a === action) ? a.progress = 0: a.progress = a.progress; return a});
          this.get(this.mode, this.id)
          }
        );
  }

  parseEvent(event: string){
    return event === null ? null : JSON.parse(event);
  }

  getType(header: any) {
    let res: string = 'text';
//    console.log(header.type);
    switch (header.type) {
       case "numeric":
       case "int":
         res = 'number'
         break;
       case "date":
         res = 'date'
         break;
       case "timestamp with time zone":
         res = 'datetime-local'
         break;
       default:
         res = 'text';
         break;
     } 
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

  getDependencies(){
    let restParams: any = {};
    restParams.order = 'code'
    restParams.where = 'ftbl=eq.' + `${this.mode}`;
    this.restService.get(this.dependenciesTable, restParams)
      .then(
          d => 
          this.dependencies=d.data.map(
            (i:any) => 
            {i.d=this.translateService.get(i.d, true, true);
              return i
            }
            )
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
      restParams.select = (this.select) ? this.select.toString() : '';
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
//                console.log(this.headers);
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
