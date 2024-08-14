import {ɵStateClass as StateClass} from '@ngxs/store/internals';

import {withNgxsPlugin, provideStates} from "@ngxs/store";

import {makeEnvironmentProviders} from "@angular/core";

import {
  NgxsRequestsPlugin,
} from "./requests.plugin";

export function withNgxsRequestsPlugin(stateClasses: StateClass[]) {
  return makeEnvironmentProviders([
    withNgxsPlugin(NgxsRequestsPlugin),
    provideStates(stateClasses),
  ]);
}
