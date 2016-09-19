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
import { Component, OnInit, OnDestroy }  from '@angular/core';

import { RestService }     from '../rest/rest.service';
import { NavigationService }     from '../navigation/navigation.service';
import { TranslateService }  from '../translate/translate.service';

import appGlobals = require('../globals');

@Component({
  selector: 'app-nav',
  providers: [NavigationService],
  templateUrl: '/app/navigation/navigation.component.html'
})

export class AppNav implements OnInit, OnDestroy {
  private menu: Array<any> = JSON.parse(appGlobals.menu);
    private isLoggedIn = false;
    private sub: any;
    private login: string = 'Войти';

  constructor(
      private restService: RestService,
      private navigationService: NavigationService,
      private translateService: TranslateService
      ) {

      this.sub = this.restService.isLoggedIn$.subscribe(val => {
        this.get();
       })
  }

  ngOnInit(){
    this.get();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  get(){
    this.menu = [];
    this.login = (this.restService.checkTocken()) ? 'Выйти' : 'Войти';
    this.translateService.load()
      .then(d=>
        this.navigationService.get()
          .then(d=>this.updateMenuFromRest(d))
      );
  }

  translate(s: string){
    return this.translateService.get(s, true, true);
  }

  updateMenuFromRest(d: any[]){
    d.map( 
        item => { 
            if (item.caption) {
               this.menu.push(item);
             } ;
        }
    );
  }
}

