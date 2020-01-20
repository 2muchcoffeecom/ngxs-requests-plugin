import { ModuleWithProviders, NgModule } from '@angular/core';
import { NGXS_PLUGINS, NgxsModule, State } from '@ngxs/store';
import { NGXS_REQUEST_PLUGIN_OPTIONS, NgxsRequestsPlugin } from './requests.service';
import { __decorate } from 'tslib';

import { RequestsState } from './requests.state';
import { states } from './util';

export function createModule(moduleClass, name) {
  __decorate(
    [
      NgModule({
        imports: [
          NgxsModule.forFeature([
            createRequestsState(name),
            ...states,
          ])
        ]
      })
    ], moduleClass
  );

  return moduleClass;
}

export function createRequestsState(name) {
  const stateClass = RequestsState;

  __decorate(
    [
      State({
        name,
        children: states,
        defaults: {}
      })
    ], stateClass
  );

  return stateClass;
}

export class RequestsModule {
  static forRoot(config = {name: 'requests'}): ModuleWithProviders {
    return {
      ngModule: createModule(RequestsModule, config.name),
      providers: [
        {
          provide: NGXS_PLUGINS,
          useClass: NgxsRequestsPlugin,
          multi: true
        },
        {
          provide: NGXS_REQUEST_PLUGIN_OPTIONS,
          useValue: config
        }
      ]
    };
  }
}
