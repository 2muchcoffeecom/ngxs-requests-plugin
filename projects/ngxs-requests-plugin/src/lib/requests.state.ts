import { Action, StateContext } from '@ngxs/store';
import { catchError, mapTo, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { IRequest } from './request.interface';

import { CreateRequest, CreateRequestFail, CreateRequestSuccess } from './requests.actions';
import { requestFailState, requestLoadingState, requestSuccessState } from './util';


export class RequestsState {
  @Action(CreateRequest)
  createRequest(ctx: StateContext<IRequest>, {payload}: CreateRequest) {
    const {path} = payload;
    ctx.patchState({[path]: requestLoadingState});

    return payload.request.pipe(
      switchMap(res => {
        const successActions = [
          new CreateRequestSuccess(res, path),
        ];
        if (payload.successAction) {
          successActions.push(new payload.successAction(res, payload.metadata));
        }
        return ctx.dispatch(successActions).pipe(
          mapTo(res)
        );
      }),
      catchError((error) => {
        const failActions = [
          new CreateRequestFail(error, path),
        ];
        if (payload.successAction) {
          failActions.push(new payload.failAction(error));
        }
        return ctx.dispatch(failActions).pipe(
          mapTo(throwError(error))
        );
      }),
      payload.response || ((obs) => obs),
    );
  }

  @Action(CreateRequestSuccess)
  requestSuccess(ctx: StateContext<IRequest>, action: CreateRequestSuccess) {
    ctx.patchState({[action.path]: requestSuccessState(action.payload)});
  }

  @Action(CreateRequestFail)
  requestFail(ctx: StateContext<IRequest>, action: CreateRequestFail) {
    ctx.patchState({[action.path]: requestFailState(action.payload)});
  }
}
