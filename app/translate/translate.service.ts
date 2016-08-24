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
            "Refresh":{"d":"Обновить"}, 
            "Select":{"d":"Выбрать"}, 
            "Cancel":{"d":"Отменить"}, 
            "Edit":{"d":"Изменить"}, 
            "Del":{"d":"Удалить"},
            "View":{"d":"Просмотр"},
            "Save":{"d":"Сохранить"},
            "Add":{"d":"Добавить"},
            "Copy":{"d":"Копировать"}
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
