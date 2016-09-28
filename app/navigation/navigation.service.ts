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
export class NavigationService {
	private path: string = 'menu';
    private listpath: string = '/l';

	constructor (
		private restService: RestService
	 ) {}

	get(): Promise<any> {
      let restParams: any = {};
      restParams.count = 0;
      restParams.order = 'code';
      restParams.where = 'code=isnot.null'
        return this.restService.get(this.path, restParams)
          .then(d =>this.extractData(d.data));
    }

  private extractData(res: any[]) {
    let resultSet: any[];
    resultSet = res.map(
                    (i:any) => {
                        var item: any ={};
                        item.caption=i.d;
                        item.params = [this.listpath, i.path];
                        item.parent = i.parent;
                        item.id = i.id;
                        //console.log(item);
                        return item;
                    }
                    )
    let menu = this.getMenuLevel(resultSet, null);
    console.log(menu)
    return menu;
  }

  private getMenuLevel(source: any[], id: any): any {
    var res: any;
    res = source.filter((i:any) => i.parent === id);
    for(var key in res) {
        if(res.hasOwnProperty(key)) {
            res[key].children = this.getMenuLevel(source, res[key].id);
        }
    };
    if (!res[0]) {
      return;
    } else {
      return res; 
    }
  }

  private handleError (error: any) {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
