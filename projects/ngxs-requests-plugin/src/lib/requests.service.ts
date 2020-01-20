import { Inject, Injectable, InjectionToken } from '@angular/core';
import { NgxsPlugin } from '@ngxs/store';

export const NGXS_REQUEST_PLUGIN_OPTIONS = new InjectionToken('NGXS_REQUEST_PLUGIN_OPTIONS');

@Injectable()
export class NgxsRequestsPlugin implements NgxsPlugin {
  constructor(@Inject(NGXS_REQUEST_PLUGIN_OPTIONS) private options: any) {
  }

  handle(state, action, next) {
    return next(state, action);
  }
}
