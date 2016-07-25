import { Injectable }     from '@angular/core';

import { RestService }     from '../rest/rest.service';

import appGlobals = require('./../globals');

@Injectable()
export class TranslateService {
	private path: string = 'translate';
    private isLoaded: number;

	constructor (
		private restService: RestService
	 ) 
    {}

    load(): Promise<any>{
        appGlobals.dictionary = JSON.parse(`{
            "Edit":{"d":"Изменить"}, 
            "Del":{"d":"Удалить"},
            "View":{"d":"Просмотр"},
            "Save":{"d":"Сохранить"},
            "Add":{"d":"Добавить"}
            }`);
        return this.restService.get(this.path)
          .then(d=>this.extractData(d.data));
    }

  private extractData(res: any[]) {

    res.map(
            (i:any) => {
                var n: any = i.j;
                for (var key in n) {
                    appGlobals.dictionary[key]=n[key];
                }
            }
        )
  }

	get(name: string, plural?: boolean, upper?: boolean): string {
        if (!appGlobals.dictionary) {
            this.load()
        }
        if (upper == true) {
            return this.firstLetterToUpper(this.translate(name, plural))
        } else {
            return this.translate(name, plural)
        }
    }

    private translate(name: string, plural?: boolean): string {
        if (appGlobals.dictionary[name]) {
            if (plural && plural == true && appGlobals.dictionary[name].plural) {
                return appGlobals.dictionary[name].plural
            } else {
                return appGlobals.dictionary[name].d
            }
        } else {
            return this.firstLetterToUpper(name.replace('_',' '));
        }
	}

    firstLetterToUpper(str: string): string {
    if (str == null)
        return null;
 
    if (str.length > 1)
        return str[0].toUpperCase() + str.substring(1);
 
    return str.toUpperCase();
    }

}
