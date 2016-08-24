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
import { Component, Input, Output, EventEmitter } from '@angular/core';

import { TranslateService }  from '../translate/translate.service';

import { KeysPipe } from '../pipe/json.pipe'


@Component({
  selector: 'json-view',
  templateUrl: 'app/json_view/json_view.component.html',
  directives: [JsonViewComponent],
  providers: [TranslateService],
  pipes: [KeysPipe],
})

export class JsonViewComponent {
  @Input() data: any;
  @Input() editMode: string;

    getType(header: any) {
    let res: string = 'text';
//    console.log(header.type);
    switch (header.type) {
       case "numeric":
       case "int":
         res = 'number'
         break;
       case "date":
         res = 'date'
         break;
       case "timestamp with time zone":
         res = 'datetime-local'
         break;
       default:
         res = 'text';
         break;
     } 
    return res;
  }

}
