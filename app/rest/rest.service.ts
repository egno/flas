import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
//import { Observable }     from 'rxjs/Observable';
import 'rxjs/Rx';


@Injectable()
export class RestService {
  constructor (private http: Http) {  }
  private configUrl = '/api/v1/';  // URL to web API
  getRest (path: string, id?: string): Promise<any> {
    let parm: string = '';
    if (id!==undefined) {parm='?uuid=eq.'+id};
    return this.http.get(this.configUrl+path+parm)
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
  private extractData(res: Response) {
    let body = res.json();
    return body;
  }
  private handleError (error: any) {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
