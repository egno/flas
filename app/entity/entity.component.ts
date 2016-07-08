import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute }       from '@angular/router';

import { RestService }     from '../rest/rest.service';


@Component({
  selector: 'entity',
  templateUrl: 'app/entity/entity.component.html',
  providers: [RestService],
})

export class EntityComponent implements OnInit, OnDestroy {
	mode: string;
	headers: any[];
  id: string;
	item: any = {};
  	private sub: any;
	errorMessage: any;
  editMode: any;

	constructor(
	    private route: ActivatedRoute,
	    private router: Router,
	    private restService: RestService
	  	) {}

	ngOnInit() {
	this.sub = this.route.params.subscribe(params => {
	   	this.mode = params['mode']; 
      this.id = params['id']; 
      this.editMode = params['edit']; 
	   	console.log(this.mode, this.id, this.editMode);
   		this.getRestHeaders(this.mode);
      if (this.editMode !== 'new') {
   		  this.getRest(this.mode, this.id);
      };
	 });
	}

	ngOnDestroy() {
	this.sub.unsubscribe();
	}

  onGo(mode: string) {
    this.router.navigate(['/l', mode]);
  }

    getRest(path: string, id: string) {
      this.restService.getRest(path, id)
          .then(
            d => {this.item = d.data[0]; console.log(this.item)}           
            )
          .catch(message => {this.errorMessage = message});
      
    } 

    getRestHeaders(path: string) {
      this.restService.getRestHeaders(path)
          .then(
            d => {this.headers = d.data.columns; console.log(this.headers)}           
            )
          .catch(message => {this.errorMessage = message});
      ;
    }  

  onEdit(item: any) {
    this.router.navigate(['/l', this.mode, item.uuid, 'e']);
  }

  onDelete(item: any) {
    if (item.uuid !== undefined) {
      this.restService.delete(this.mode, item)
      .then(res => {this.router.navigate(['/l', this.mode])})
    }
  }

  onSave(item: any) {
    if (item.uuid !== undefined) {
      this.restService.patch(this.mode, this.item)
        .then(res => {this.router.navigate(['/l', this.mode, item.uuid])});
    } else {
      this.restService.post(this.mode, this.item)
        .then(id => {this.router.navigate(['/l', this.mode, id])});
    }
  }

}
