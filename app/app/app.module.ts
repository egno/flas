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