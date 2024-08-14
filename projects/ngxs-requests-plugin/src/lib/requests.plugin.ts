import { Injectable, Injector } from "@angular/core";
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
import { catchError, map, switchMap } from "rxjs/operators";
import { of, throwError } from "rxjs";

@Injectable()
export class NgxsRequestsPlugin implements NgxsPlugin {
  constructor(private _injector: Injector) {}

  handle(oldState: any, action: any, next: any) {
    let state = { ...oldState };
    const type = getActionTypeFromInstance(action);
    const stateName: undefined | string =
      action?.payload?.state?.NGXS_OPTIONS_META?.name;

    if (stateName && type === `[Request] ${stateName} Start`) {
      state = setValue(state, stateName, requestLoadingState);
    }

    if (action.path && type === `[Request] ${action.path} Success`) {
      state = setValue(state, action.path, requestSuccessState(action.payload));
    }

    if (action.path && type === `[Request] ${action.path} Fail`) {
      state = setValue(state, action.path, requestFailState(action.payload));
    }

    return next(state, action).pipe(
      switchMap((response) => {
        if (stateName && type === `[Request] ${stateName} Start`) {
          const store = this._injector.get(Store);

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
              return store.dispatch(successActions).pipe(map(() => res));
            }),
            catchError((error) => {
              const failActions = [createRequestFailAction(error, stateName)];
              if (action.payload.failAction) {
                failActions.push(
                  new action.payload.failAction(error, action.payload.metadata)
                );
              }
              return store.dispatch(failActions).pipe(
                map(() => {
                  return throwError(() => error);
                })
              );
            })
          );
        }
        return of(response);
      })
    );
  }
}
