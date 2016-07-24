import { Component, OnInit }  from '@angular/core';
import {
  ROUTER_DIRECTIVES,
} from '@angular/router';

import { RestService }     from '../rest/rest.service';
import { NavigationService }     from '../navigation/navigation.service';

import appGlobals = require('../globals');

@Component({
  selector: 'app-nav',
  directives: [ROUTER_DIRECTIVES],
  providers: [RestService, NavigationService],
  templateUrl: '/app/navigation/navigation.component.html'
})

export class AppNav implements OnInit {
  menu: Array<any> = JSON.parse(appGlobals.menu);

  constructor(
      private navigationService: NavigationService
      ) {}

  ngOnInit(){
    this.get();
  }

  get(){
    this.navigationService.get()
      .then(d=>this.updateMenu(d));
  }

  updateMenu(d: any[]){
    d.map( 
        item => { 
            if (item.caption) {this.menu.push(item)} ;
        }
    )
  }
}

