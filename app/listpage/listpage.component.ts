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
import { Component, Input, Output, EventEmitter, 
  OnInit, AfterContentInit, OnDestroy } from '@angular/core';
import {  Router, ActivatedRoute }       from '@angular/router';

import { TstzPipe } from '../pipe/tstz.pipe'

import { RestService }     from '../rest/rest.service';
import { TranslateService }  from '../translate/translate.service';
import { DropdownButtonComponent }     from '../dropdown_button/dropdown_button.component';


@Component({
  selector: 'listpage',
  templateUrl: 'app/listpage/listpage.component.html'
})

export class ListpageComponent implements OnInit, AfterContentInit, OnDestroy {
 
 @Input() imode:string;
 @Output() selectEvent = new EventEmitter<string>();

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
  where: string;
  parent: any ={};
  parent_mode: string;
  parent_id: string;
  dependencies: any[];
  dependenciesTable: string = 'constraint_relations';
  rpcParent:string = 'parent';

	constructor(
	    private route: ActivatedRoute,
	    private router: Router,
	    private restService: RestService,
      private translateService: TranslateService
	  	) {}

	ngOnInit() {
	this.sub = this.route.params.subscribe(params => {
      this.where = params['where']; 
      this.parent.mode = params['parent_mode']; 
      this.parent.dmode = params['parent_dmode']; 
      this.parent.d = params['parent_d']; 
      if (this.imode) {
        this.modal = 'modal';
        this.mode = this.imode;
      } else {
        this.modal = '';
         this.mode = params['mode']; 
      }
      if (this.where) {
        this.parent.id = this.where.substring(this.where.search('=')+4, this.where.length); 
        this.parent.field = this.where.substring(0,this.where.search('='));
        this.getParent(this.parent.field, this.parent.id);
      }
      delete this.dependencies;
      this.order = [{}];
      this.headers = [];
   		this.getHeaders(this.mode);
      this.dmode = this.translateService.get(this.mode,true,true);
      this.getActions();
      this.getDependencies();
   });
    this.labels.Refresh='Refresh';
    this.labels.Select='Select';
    this.labels.Cancel='Cancel';
    this.labels.Edit='Edit';
    this.labels.Del='Del';
    this.labels.View='View';
    this.labels.Add='Add';
    this.labels.Copy='Copy';
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
    this.router.navigate(['/l', this.mode, 0, {'edit':'new'}]);
  }

  onCopy(item: any) {
    this.router.navigate(['/l', this.mode, item.id, {'edit':'copy'}]);
  }

  onEdit(item: any) {
    this.router.navigate(['/l', this.mode, item.id, {'edit':'e'}]);
  }

  onView(item: any) {
    this.router.navigate(['/l', this.mode, item.id]);
  }

  onNext(page: number = 0) {
    this.page+=1;
    this.getData(this.mode);
  }

  onPrev(page: number = 0) {
    this.page-=1;
    this.getData(this.mode);
  }

  onLast() {
    this.page=this.pages;
    this.getData(this.mode);
  }

  onFirst() {
    this.page=1;
    this.getData(this.mode);
  }

  onSort(header: any, event:any) {
    let v: any = {};
    v.name = header.name;
    if (header.references) {
       v.order_name = header.references.table+'_'+v.name;
    } else {
       v.order_name = v.name;
    };
    v.desc = this.order.reduce((r, i) => r || (i.name===v.name && !i.desc), false);
    if (!event.ctrlKey) {
      this.order = [{}];
    }
    this.order = this.order.filter(i => (i.name && i.name !== header.name));
    this.order.push(v);
//    console.log(this.order);
    this.getData(this.mode);
  }

  onRefresh() {
    this.getData(this.mode);
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

  onDetail(h: any, id: string){
    this.router.navigate(['/l', h.references.table, id]);
  }

  translateHeaders(){
    this.headers = this.headers.map(
        h => {h.d = this.translateService.firstLetterToUpper(this.translateService.get(h.name)); return h;}
      )
  }

  getDisplayHeaders(){
    this.dheaders = this.headers.filter(
      h => (h.name !== 'id' && h.name !== 'ts' && h.type !== 'json' && h.type !== 'jsonb' 
        && !(this.where && h.name === this.parent.field )
        ) 
      );
     console.log(this.dheaders)
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
    this.select = this.headers.sort((i,j) => (j.name === 'code')?1:0).map(i => {return <string>
      (i.references) ? `${i.name}{d,id}` : i.name;
    });
  }

  getData(path: string) {
    console.log('get');
      let filter: string;
      let restParams: any = {};
      let defaultOrder: string = 'd';
      if (this.headers.findIndex(i => i.name === 'code') != -1) {defaultOrder = 'code,d'};
      this.selectedItem='';
      this.page = (this.page <1)? 1 : this.page;
      this.page = (this.page > this.pages)? this.pages : this.page;
      restParams.page = this.page;
      restParams.count = this.count;
      restParams.order = this.order.filter(i => i.order_name).map(i => `${i.order_name}` + ((i.desc) ? '.desc' : '')).join(',');
      restParams.order = restParams.order || defaultOrder;
      restParams.select = this.select.toString();
      restParams.where = this.where;
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
            restParams.where = filter
          } else {
            restParams.where = restParams.where + '&'+ filter;
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
                console.log(this.data);
                }           
            )
          .catch(message => {this.errorMessage = message; this.page=1; this.pages=1});
      ;
    } 

  getHeaders(path: string) {
    console.log('getHeaders');
      this.restService.getHeaders(path)
          .then(
            d => {this.headers = d.data;
              console.log(this.headers);
              this.checkSelect();
              this.getData(this.mode);
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
          )
  }

  getParent(mode: string, id: string) {
    let restParams: any = {};
    restParams.table = this.mode;
    restParams.field = mode;
    restParams.id = id;
    this.restService.rpc(this.rpcParent, restParams)
      .then(p => console.log(p)
           )
  }

}
