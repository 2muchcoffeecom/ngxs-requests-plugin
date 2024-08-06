import { ModuleWithProviders, NgModule } from '@angular/core';
import { NGXS_PLUGINS, NgxsModule, State } from '@ngxs/store';

import { NGXS_REQUEST_PLUGIN_REQUESTS_PATH_OPTIONS, NGXS_REQUEST_PLUGIN_STATE_CLASSES, NgxsRequestsPlugin } from './requests.service';
import { RequestsState } from './requests.state';
import { StateClass } from '@ngxs/store/internals';

export function stateClassFactory(name: string, states: StateClass[]) {
  State({
    name,
    children: states
  })(RequestsState);

  return [RequestsState, ...states];
}

@NgModule({
  imports: [
    NgxsModule.forFeature(),
  ]
})
export class RequestsModule {
  static forRoot(stateClasses: StateClass[], requestsStateName: string = 'requests'): ModuleWithProviders<RequestsModule> {

    // TODO fetch FEATURE_STATE_TOKEN from import
    const featureStateProvider: any = NgxsModule.forFeature()?.providers?.find((provider: any) => {
      return provider?.provide?._desc === 'FEATURE_STATE_TOKEN';
    })

    return {
      ngModule: RequestsModule,
      providers: [
        RequestsState,
        ...stateClasses,
        {
          provide: featureStateProvider.provide,
          multi: true,
          useFactory: stateClassFactory,
          deps: [NGXS_REQUEST_PLUGIN_REQUESTS_PATH_OPTIONS, NGXS_REQUEST_PLUGIN_STATE_CLASSES]
        },
        {
          provide: NGXS_PLUGINS,
          useClass: NgxsRequestsPlugin,
          multi: true,
        },
        {
          provide: NGXS_REQUEST_PLUGIN_STATE_CLASSES,
          useValue: stateClasses
        },
        {
          provide: NGXS_REQUEST_PLUGIN_REQUESTS_PATH_OPTIONS,
          useValue: requestsStateName
        },
      ]
    };
  }
}
