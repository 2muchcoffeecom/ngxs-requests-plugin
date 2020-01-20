import { __decorate } from 'tslib';
import { State } from '@ngxs/store';

import { IRequest } from './request.interface';
import { RequestStatus } from './request-status.enum';

export let states = [];

export function createRequestState(name) {
  const requestState = class {
  };

  __decorate(
    [State({
      name,
      defaults: requestInitialState
    })], requestState
  );

  states.push(requestState);

  return requestState;
}


export const requestInitialState: IRequest = {
  loading: false,
  loaded: false,
  status: '',
  data: null,
};

export const requestLoadingState: IRequest = {
  loading: true,
  loaded: false,
  status: '',
  data: null,
};

export const requestSuccessState = <U = any>(payload: U): IRequest => {
  return {
    loading: false,
    loaded: true,
    status: RequestStatus.Success,
    data: payload,
  };
};

export const requestFailState = <U = any>(payload: U): IRequest => {
  return {
    loading: false,
    loaded: true,
    status: RequestStatus.Fail,
    data: payload,
  };
};
