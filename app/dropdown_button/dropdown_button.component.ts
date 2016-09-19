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

import {Component, Input} from '@angular/core';
import { DropdownModule } from 'ng2-bootstrap/ng2-bootstrap';
import { Router, ActivatedRoute }       from '@angular/router';
 

@Component({
  selector: 'dropdown-button',
  template: `
  <div class="btn-group" role="group" dropdown [(isOpen)]="status.isopen">
    <button type="button" class="btn btn-default btn-sm" dropdownToggle [disabled]="disabled">
      {{caption}} <span class="caret"></span>
    </button>
    <ul dropdownMenu role="menu" aria-labelledby="single-button">
      <li *ngFor="let item of menuitems" role="menuitem">
        <a class="dropdown-item" href="'#'" 
          [routerLink]="[
            '/l', 
            item.path, 
            {
                'where': item.fld + '=eq.'+ selectedItem.id, 
                'parent_mode': parent.mode, 
                'parent_dmode': parent.dmode, 
                'parent_d': selectedItem.d
             }]">{{item.d}}</a>
      </li>
    </ul>
  </div>`
})

export class DropdownButtonComponent {
 @Input() caption:string;
 @Input() disabled:boolean = false;
 @Input() menuitems:any[];
 @Input() parent:any;
 @Input() selectedItem:any;

  public status:{isopen:boolean} = {isopen: false};
 
  public toggled(open:boolean):void {
    console.log('Dropdown is now: ', open);
  }
 
  public toggleDropdown($event:MouseEvent):void {
    $event.preventDefault();
    $event.stopPropagation();
    this.status.isopen = !this.status.isopen;
  }
}

