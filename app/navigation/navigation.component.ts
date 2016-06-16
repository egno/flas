import { Component, OnInit } from '@angular/core';
import 'rxjs/Rx';

import { RestService }     from '../rest/rest.service';


@Component({
  selector: 'navigation',
  templateUrl: 'app/navigation/navigation.component.html',
  providers: [RestService],
})

export class NavigationComponent implements OnInit {
  errorMessage: string;
  navigation: Array<any> = [];
    constructor(
        private restService: RestService 
      ) { } 

    ngOnInit() {
      this.getRest('navigation');
    }

    getRest(path: string) {
      this.restService.getRest(path)
          .subscribe(
            data => {this.navigation = data},            
            error => {this.errorMessage = <any>error}
            );
    }

}
