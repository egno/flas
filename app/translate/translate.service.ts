import { Injectable }     from '@angular/core';

import { RestService }     from '../rest/rest.service';

import appGlobals = require('./../globals');

@Injectable()
export class TranslateService {
	private dictionary = JSON.parse(`{
        "Edit":{"d":"Изменить"}, 
        "Del":{"d":"Удалить"},
        "View":{"d":"Просмотр"},
        "Save":{"d":"Сохранить"},
        "Add":{"d":"Добавить"}
    }`);
	private path: string = 'translate';

	constructor (
		private restService: RestService
	 ) 
	{
		this.restService.get(this.path)
          .then(
            d => {
            	d.data.map(
            		(i:any) => {
            			var n: any = i.j;
            			for (var key in n) {
            				this.dictionary[key]=n[key];
            			}
            		}
            		)
              }
            )
	}

	get(name: string) {
		return (this.dictionary[name]) ? this.dictionary[name].d: name;
	}

}
