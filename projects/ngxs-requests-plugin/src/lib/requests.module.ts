import { ModuleWithProviders, NgModule } from "@angular/core";
import { NGXS_PLUGINS, NgxsModule, provideStates } from "@ngxs/store";

import {
  NGXS_REQUEST_PLUGIN_REQUESTS_PATH_OPTIONS,
  NGXS_REQUEST_PLUGIN_STATE_CLASSES,
  NgxsRequestsPlugin,
} from "./requests.service";
import { RequestsState } from "./requests.state";
import { ɵStateClass } from "@ngxs/store/internals";

@NgModule({
  imports: [NgxsModule.forFeature()],
})
export class RequestsModule {
  static forRoot(
    stateClasses: ɵStateClass[],
    requestsStateName: string = "requests"
  ): ModuleWithProviders<RequestsModule> {
    return {
      ngModule: RequestsModule,
      providers: [
        RequestsState,
        provideStates(stateClasses),
        {
          provide: NGXS_PLUGINS,
          useClass: NgxsRequestsPlugin,
          multi: true,
        },
        {
          provide: NGXS_REQUEST_PLUGIN_STATE_CLASSES,
          useValue: stateClasses,
        },
        {
          provide: NGXS_REQUEST_PLUGIN_REQUESTS_PATH_OPTIONS,
          useValue: requestsStateName,
        },
      ],
    };
  }
}
