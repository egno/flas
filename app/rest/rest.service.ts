import { Injectable }     from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
//import { Observable }     from 'rxjs/Observable';
import 'rxjs/Rx';


@Injectable()
export class RestService {
  constructor (private http: Http) {  }
  private configUrl = '/api/v1/';  // URL to web API

  get (path: string, page: number, count:number = 10): Promise<any> {
    let headers = new Headers();
    headers.append('Range-Unit', 'items');
    headers.append('Range', `${(page-1) * count}-${page * count -1}`);
    let parm: string = '';
    return this.http.get(this.configUrl+path+parm, {headers: headers})
                    .toPromise()
                    .then(this.extractData)
                    .catch(this.handleError);
  }

  getRest (path: string, id?: string): Promise<any> {
    let headers = new Headers();
    headers.append('Range-Unit', 'items');
    headers.append('Range', '0-0');
    let parm: string = '';
    if (id!==undefined) {parm='?uuid=eq.'+id};
    return this.http.get(this.configUrl+path+parm, {headers: headers})
                    .toPromise()
                    .then(this.extractData)
                    .catch(this.handleError);
  }
  getRestHeaders (path: string): Promise<any> {
    return this.http.request(this.configUrl+path, {method: 'Options'})
                    .toPromise()
                    .then(this.extractData)
                    .catch(this.handleError);
  }

  patch(mode: string, item: any) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let url = `${this.configUrl}${mode}?uuid=eq.${item.uuid}`;

    return this.http
               .patch(url, JSON.stringify(item), {headers: headers})
               .toPromise()
               .then(() => item)
               .catch(this.handleError);
  }

  post(mode: string, item: any) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let url = `${this.configUrl}${mode}`;

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

  delete(mode: string, item: any) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let url = `${this.configUrl}${mode}?uuid=eq.${item.uuid}`;

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
