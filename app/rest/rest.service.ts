import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
//import { Observable }     from 'rxjs/Observable';
import 'rxjs/Rx';


@Injectable()
export class RestService {
  constructor (private http: Http) {  }
  private configUrl = 'http://192.168.1.58:3100/';  // URL to web API
  getRest (path: string): Promise<any> {
    return this.http.get(this.configUrl+path)
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
