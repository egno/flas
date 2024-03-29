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

import { NgModule }       from '@angular/core';
import { BrowserModule  } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { RouterModule }   from '@angular/router';
import { HttpModule }     from '@angular/http';

import { routing,
         appRoutingProviders } from '../app/app.routes';

import { Ng2BootstrapModule } from 'ng2-bootstrap/ng2-bootstrap';         

import { AppComponent }   from '../app/app.component';
import { AppNav } from '../navigation/navigation.component';
import { LoginComponent }  from '../login/login.component';
import { TestComponent }  from '../test/test.component';
import { ListpageComponent }  from '../listpage/listpage.component';
import { EntityComponent }  from '../entity/entity.component';
import { DropdownButtonComponent }  from '../dropdown_button/dropdown_button.component';
import { JsonViewComponent }  from '../json_view/json_view.component';


import { TstzPipe }  from '../pipe/tstz.pipe';
import { KeysPipe }  from '../pipe/json.pipe';


@NgModule({
    declarations: [
        AppComponent,
        AppNav,
        TestComponent,
        ListpageComponent,
        EntityComponent,
        LoginComponent,
        DropdownButtonComponent,
        JsonViewComponent,
        TstzPipe,
        KeysPipe
    ],
    imports:      [
        BrowserModule, 
        //Router,
        RouterModule, 
        routing,
        //Forms,
        FormsModule, 
        HttpModule,
        Ng2BootstrapModule,
        // Material Design
        //MdSlideToggleModule, 
        //MdButtonModule, 
        //MdToolbarModule, 
    	//MdCardModule, 
    	//MdInputModule,
    ],
    bootstrap:    [AppComponent],
})

export class AppModule {}