import { Component, OnInit }  from '@angular/core';
import {
  ROUTER_DIRECTIVES,
} from '@angular/router';

import { RestService }     from '../rest/rest.service';
import { NavigationService }     from '../navigation/navigation.service';
import { TranslateService }  from '../translate/translate.service';

import appGlobals = require('../globals');

@Component({
  selector: 'app-nav',
  directives: [ROUTER_DIRECTIVES],
  providers: [RestService, NavigationService, TranslateService],
  templateUrl: '/app/navigation/navigation.component.html'
})

export class AppNav implements OnInit {
  menu: Array<any> = JSON.parse(appGlobals.menu);

  constructor(
      private navigationService: NavigationService,
      private translateService: TranslateService
      ) {}

  ngOnInit(){
    this.get();
  }

  get(){
    this.translateService.load()
      .then(d=>
        this.navigationService.get()
          .then(d=>this.updateMenuFromRest(d))
      );
  }

  updateMenuFromRest(d: any[]){
    d.map( 
        item => { 
            if (item.caption) {
                item.caption = this.translateService.get(item.caption, true, true);
               this.menu.push(item);
             } ;
        }
    )
  }
}

