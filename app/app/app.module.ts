import { NgModule }       from '@angular/core';
import { BrowserModule  } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { RouterModule }   from '@angular/router';
import { HttpModule }     from '@angular/http';

import { routing,
         appRoutingProviders } from '../app/app.routes';

import { AppComponent }   from '../app/app.component';
import { AppNav } from '../navigation/navigation.component';
import { TestComponent }  from '../test/test.component';
import { ListpageComponent }  from '../listpage/listpage.component';
import { EntityComponent }  from '../entity/entity.component';


@NgModule({
    declarations: [
        AppComponent,
        AppNav,
        TestComponent,
        ListpageComponent,
        EntityComponent
    ],
    imports:      [
        BrowserModule, 
        //Router,
        RouterModule, 
        routing,
        //Forms,
        FormsModule, 
        HttpModule,
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