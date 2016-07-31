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
import { Injectable }     from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
//import { Observable }     from 'rxjs/Observable';
import 'rxjs/Rx';

import appGlobals = require('../globals');

@Injectable()
export class RestService {
  constructor (private http: Http) {  }
  private configUrl = appGlobals.api;  // URL to web API

  get (path: string, params?: any, url?: string): Promise<any> {
//    console.log(params);
    let headers = new Headers();
    let id: number;
    let page: number;
    let count: number;
    let parm: string = '';
    if (typeof params !== 'undefined') {
      if (typeof params.id !== 'undefined') {
        id = params.id;
        page = 1;
        count = 0;
        parm='id=eq.'+id;
      } else {
        page = (typeof params.page !== 'undefined') ? params.page : 1;
        count = (typeof params.count !== 'undefined') ? params.count : 20;
      };
      parm = (typeof params.where !== 'undefined') ? ((parm.length > 0)? `${parm}&`: '') + `${params.where}` : parm;
      parm = (typeof params.order !== 'undefined') ? ((parm.length > 0)? `${parm}&`: '') + `order=${params.order}` : parm;
      parm = (typeof params.select !== 'undefined') ? ((parm.length > 0)? `${parm}&`: '') + `select=${params.select}` : parm;
    }
    headers.append('Range-Unit', 'items');
    headers.append('Range', `${(page -1) * count}-${page * count -1}`);
    parm = (parm.length > 0) ? `?${parm}`: '';
    url = (url) ? url : this.configUrl;
    return this.http.get(url+path+parm, {headers: headers})
                    .toPromise()
                    .then(this.extractData)
                    .catch(this.handleError);
  }

  getHeaders (path: string, url?: string): Promise<any> {
    url = (url) ? url : this.configUrl;
    return this.http.request(url+path, {method: 'Options'})
                    .toPromise()
                    .then(this.extractData)
                    .catch(this.handleError);
  }

  patch(mode: string, item: any, url?: string) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    url = (url) ? url : this.configUrl;
    url = `${this.configUrl}${mode}?id=eq.${item.id}`;

    return this.http
               .patch(url, JSON.stringify(item), {headers: headers})
               .toPromise()
               .then(() => item)
               .catch(this.handleError);
  }

  post(mode: string, item?: any, url?: string) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    url = (url) ? url : this.configUrl;
    url = `${this.configUrl}${mode}`;

    return this.http
               .post(url, JSON.stringify(item), {headers: headers})
               .toPromise()
               .then(p => {
                   let url=p.headers.get('Location');
                   if (url) {
                     let ids = url.match(/([a-f]|\d|-){36}/);
                     return ids[0];
                   } else {
                     return '#'
                   }
                 })
               .catch(this.handleError);
  }

  delete(mode: string, item: any, url?: string) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    url = (url) ? url : this.configUrl;
    url = `${this.configUrl}${mode}?id=eq.${item.id}`;

    return this.http
               .delete(url, {headers: headers})
               .toPromise()
               .then(() => item)
               .catch(this.handleError);
  }

  private extractData(res: Response) {
    let resultSet: any = {};
    resultSet.totals = res.headers.get('Content-Range');
    if (resultSet.totals) {
       resultSet.total = +resultSet.totals.match(/[\d]+$/)[0];
       if (resultSet.total !== 0) {
         resultSet.start = +resultSet.totals.match(/^[^-]+/)[0];
         resultSet.end = +resultSet.totals.match(/(?:-)([\d]+)/)[1];
       } else {
         resultSet.start = 0;
         resultSet.end = 0;
       }
     };
    resultSet.data = res.json();
//    console.log(resultSet);
    return resultSet;
  }

  private handleError (error: any) {
    console.error('An error occurred', error);
    appGlobals.note=error.message;
    return Promise.reject(error.message || error);
  }
}
