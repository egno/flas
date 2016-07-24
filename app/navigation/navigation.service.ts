import { Injectable }     from '@angular/core';

import { RestService }     from '../rest/rest.service';

import appGlobals = require('./../globals');

@Injectable()
export class NavigationService {
	private path: string = 'menu';
    private listpath: string = '/l';

	constructor (
		private restService: RestService
	 ) {}

	get(): Promise<any> {
        return this.restService.get(this.path)
          .then(d=>this.extractData(d.data));
    }

  private extractData(res: any[]) {
    let resultSet: any[];
    resultSet = res.map(
                    (i:any) => {
                        var item: any ={};
                        item.caption=i.d;
                        item.params = [];
                        item.params = [this.listpath, i.path];
                        //console.log(item);
                        return item;
                    }
                    )
    console.log(resultSet);
    return resultSet;
  }

  private handleError (error: any) {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
