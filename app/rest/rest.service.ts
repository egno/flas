import { Injectable }     from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
//import { Observable }     from 'rxjs/Observable';
import 'rxjs/Rx';

import appGlobals = require('./../globals');

@Injectable()
export class RestService {
  constructor (private http: Http) {  }
  private configUrl = appGlobals.api || '/api/v1/';  // URL to web API

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
        parm='uuid=eq.'+id;
      } else {
        page = (typeof params.page !== 'undefined') ? params.page : 1;
        count = (typeof params.count !== 'undefined') ? params.count : 20;
      };
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
    url = `${this.configUrl}${mode}?uuid=eq.${item.uuid}`;

    return this.http
               .patch(url, JSON.stringify(item), {headers: headers})
               .toPromise()
               .then(() => item)
               .catch(this.handleError);
  }

  post(mode: string, item: any, url?: string) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    url = (url) ? url : this.configUrl;
    url = `${this.configUrl}${mode}`;

    return this.http
               .post(url, JSON.stringify(item), {headers: headers})
               .toPromise()
               .then(p => {
                   let url=p.headers.get('Location');
                   let ids = url.match(/([a-f]|\d|-){36}/);
                   return ids[0];
                 })
               .catch(this.handleError);
  }

  delete(mode: string, item: any, url?: string) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    url = (url) ? url : this.configUrl;
    url = `${this.configUrl}${mode}?uuid=eq.${item.uuid}`;

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
       resultSet.start = +resultSet.totals.match(/^[^-]+/)[0];
       resultSet.end = +resultSet.totals.match(/(?:-)([\d]+)/)[1];
     };
    resultSet.data = res.json();
//    console.log(resultSet);
    return resultSet;
  }

  private handleError (error: any) {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
