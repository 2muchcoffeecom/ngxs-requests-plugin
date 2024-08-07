import {
  Inject,
  Injectable,
  InjectionToken,
  Injector,
  Optional,
} from "@angular/core";
import {
  getActionTypeFromInstance,
  NgxsPlugin,
  setValue,
  Store,
} from "@ngxs/store";
import {
  requestLoadingState,
  createRequestSuccessAction,
  requestSuccessState,
  createRequestFailAction,
  requestFailState,
} from "./util";
import { catchError, mapTo, switchMap } from "rxjs/operators";
import { of, throwError } from "rxjs";

export const NGXS_REQUEST_PLUGIN_STATE_CLASSES = new InjectionToken(
  "NGXS_REQUEST_PLUGIN_STATE_CLASSES"
);
export const NGXS_REQUEST_PLUGIN_REQUESTS_PATH_OPTIONS = new InjectionToken(
  "NGXS_REQUEST_PLUGIN_REQUESTS_PATH_OPTIONS"
);

@Injectable()
export class NgxsRequestsPlugin implements NgxsPlugin {
  constructor(
    @Inject(NGXS_REQUEST_PLUGIN_STATE_CLASSES) private statesPath: string[],
    @Optional()
    @Inject(NGXS_REQUEST_PLUGIN_REQUESTS_PATH_OPTIONS)
    private requestsPath: string = "requests",
    private injector: Injector
  ) {}

  handle(oldState: any, action: any, next: any) {
    let state = { ...oldState };
    const type = getActionTypeFromInstance(action);
    const stateName: undefined | string =
      action?.payload?.state?.NGXS_OPTIONS_META?.name;

    if (stateName && type === `[Request] ${stateName} Start`) {
      state = setValue(
        state,
        `${this.requestsPath}.${stateName}`,
        requestLoadingState
      );
    }

    if (action.path && type === `[Request] ${action.path} Success`) {
      state = setValue(
        state,
        `${this.requestsPath}.${action.path}`,
        requestSuccessState(action.payload)
      );
    }

    if (action.path && type === `[Request] ${action.path} Fail`) {
      state = setValue(
        state,
        `${this.requestsPath}.${action.path}`,
        requestFailState(action.payload)
      );
    }

    return next(state, action).pipe(
      switchMap((response) => {
        if (stateName && type === `[Request] ${stateName} Start`) {
          const store = this.injector.get(Store);

          return action.payload.request.pipe(
            switchMap((res) => {
              const successActions = [
                createRequestSuccessAction(res, stateName),
              ];
              if (action.payload.successAction) {
                successActions.push(
                  new action.payload.successAction(res, action.payload.metadata)
                );
              }
              return store.dispatch(successActions).pipe(mapTo(res));
            }),
            catchError((error) => {
              const failActions = [createRequestFailAction(error, stateName)];
              if (action.payload.failAction) {
                failActions.push(
                  new action.payload.failAction(error, action.payload.metadata)
                );
              }
              return store.dispatch(failActions).pipe(mapTo(throwError(error)));
            })
          );
        }

        return of(response);
      })
    );
  }
}
