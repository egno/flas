import { Injectable }     from '@angular/core';

import appGlobals = require('./../globals');

@Injectable()
export class SettingsService {
	private settings = appGlobals;

	get(name?: string) {
		if (name) {
			return this.settings[name];
		} else {
			return this.settings;
		};
	}

	set(val: any, name?: string) {
		if (name) {
			this.settings[name] = val;
			return this.settings[name];
		} else {
			this.settings = val;
			return this.settings;
		};
	}

}